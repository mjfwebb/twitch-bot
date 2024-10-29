/* eslint-disable max-len */
import crypto from 'crypto';
import websocket from 'websocket';
import { z } from 'zod';
import type { OBSConfig } from '../../config';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

let connectionRef: websocket.connection | undefined;

export const getOBSWebSocketConnection = () => connectionRef;

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: string) => void;
};

const pendingRequests: Map<string, PendingRequest> = new Map();

const WebsocketOpCodes = {
  Hello: 0, // The initial message sent by obs-websocket to newly connected clients.
  Identify: 1, // The message sent by a newly connected client to obs-websocket in response to a Hello.
  Identified: 2, // The response sent by obs-websocket to a client after it has successfully identified with obs-websocket.
  Reidentify: 3, // The message sent by an already-identified client to update identification parameters.
  Event: 5, // The message sent by obs-websocket containing an event payload.
  Request: 6, // The message sent by a client to obs-websocket to perform a request.
  RequestResponse: 7, // The message sent by obs-websocket in response to a particular request from a client.
  RequestBatch: 8, // The message sent by a client to obs-websocket to perform a batch of requests.
  RequestBatchResponse: 9, // The message sent by obs-websocket in response to a particular batch of requests from a client.
} as const;

const WebSocketCloseCode = {
  DontClose: 0, // For internal use only to tell the request handler not to perform any close action.
  UnknownReason: 4000, // Unknown reason, should never be used.
  MessageDecodeError: 4002, // The server was unable to decode the incoming websocket message.
  MissingDataField: 4003, // A data field is required but missing from the payload.
  InvalidDataFieldType: 4004, // A data field's value type is invalid.
  InvalidDataFieldValue: 4005, // A data field's value is invalid.
  UnknownOpCode: 4006, // The specified op was invalid or missing.
  NotIdentified: 4007, // The client sent a websocket message without first sending Identify message.
  AlreadyIdentified: 4008, // The client sent an Identify message while already identified..
  AuthenticationFailed: 4009, // The authentication attempt (via Identify) failed.
  UnsupportedRpcVersion: 4010, // The server detected the usage of an old version of the obs-websocket RPC protocol.
  SessionInvalidated: 4011, // The websocket session has been invalidated by the obs-websocket server.
  UnsupportedFeature: 4012, // A requested feature is not supported due to hardware/software limitations.
} as const;

const RequestBatchExecutionType = {
  None: -1, // Not a request batch.
  SerialRealtime: 0, // A request batch which processes all requests serially, as fast as possible.
  SerialFrame: 1, // A request batch type which processes all requests serially, in sync with the graphics thread. Designed to provide high accuracy for animations.
  Parallel: 2, // A request batch type which processes all requests using all available threads in the thread pool.
} as const;

const RequestStatus = {
  Unknown: 0, // Unknown status, should never be used.
  NoError: 10, // For internal use to signify a successful field check.
  Success: 100, // The request has succeeded.
  MissingRequestType: 203, // The requestType field is missing from the request data.
  UnknownRequestType: 204, // The request type is invalid or does not exist.
  GenericError: 205, // Generic error code.
  UnsupportedRequestBatchExecutionType: 206, // The request batch execution type is not supported.
  NotReady: 207, // The server is not ready to handle the request.
  MissingRequestField: 300, // A required request field is missing.
  MissingRequestData: 301, // The request does not have a valid requestData object.
  InvalidRequestField: 400, // Generic invalid request field message.
  InvalidRequestFieldType: 401, // A request field has the wrong data type.
  RequestFieldOutOfRange: 402, // A request field (number) is outside of the allowed range.
  RequestFieldEmpty: 403, // A request field (string or array) is empty and cannot be.
  TooManyRequestFields: 404, // There are too many request fields (eg. a request takes two optionals, where only one is allowed at a time).
  OutputRunning: 405, // An output is running and cannot be in order to perform the request.
  OutputNotRunning: 500, // An output is not running and should be.
  OutputPaused: 501, // An output is paused and should not be.
  OutputNotPaused: 502, // An output is not paused and should be.
  OutputDisabled: 503, // An output is disabled and should not be.
  StudioModeActive: 504, // Studio mode is active and cannot be.
  StudioModeNotActive: 505, // Studio mode is not active and should be.
  ResourceNotFound: 506, // The resource was not found.
  ResourceAlreadyExists: 600, // The resource already exists.
  InvalidResourceType: 601, // The type of resource found is invalid.
  NotEnoughResources: 602, // There are not enough instances of the resource in order to perform the request.
  InvalidResourceState: 603, // The state of the resource is invalid. For example, if the resource is blocked from being accessed.
  InvalidInputKind: 604, // The specified input (obs_source_t-OBS_SOURCE_TYPE_INPUT) had the wrong kind.
  ResourceNotConfigurable: 605, // The resource does not support being configured.
  InvalidFilterKind: 606, // The specified filter (obs_source_t-OBS_SOURCE_TYPE_FILTER) had the wrong kind.
  ResourceCreationFailed: 607, // Creating the resource failed.
  ResourceActionFailed: 700, // Performing an action on the resource failed.
  RequestProcessingFailed: 701, // Processing the request failed unexpectedly.
  CannotAct: 702, // The combination of request fields cannot be used to perform an action.
  RequestStatus: 703, // The combination of request fields cannot be used to perform an action.
} as const;

const EventSubscriptions = {
  None: 0, // Subcription value used to disable all events.
  General: 1 << 0, // Subscription value to receive events in the General category.
  Config: 1 << 1, // Subscription value to receive events in the Config category.
  Scenes: 1 << 2, // Subscription value to receive events in the Scenes category.
  Inputs: 1 << 3, // Subscription value to receive events in the Inputs category.
  Transitions: 1 << 4, // Subscription value to receive events in the Transitions category.
  Filters: 1 << 5, // Subscription value to receive events in the Filters category.
  Outputs: 1 << 6, // Subscription value to receive events in the Outputs category.
  SceneItems: 1 << 7, // Subscription value to receive events in the SceneItems category.
  MediaInputs: 1 << 8, // Subscription value to receive events in the MediaInputs category.
  Vendors: 1 << 9, // Subscription value to receive the VendorEvent event.
  Ui: 1 << 10, // Subscription value to receive events in the Ui category.
  All: 1 << 11, // Helper to receive all non-high-volume events.
  InputVolumeMeters: 1 << 16, // Subscription value to receive the InputVolumeMeters high-volume event.
  InputActiveStateChanged: 1 << 17, // Subscription value to receive the InputActiveStateChanged high-volume event.
  InputShowStateChanged: 1 << 18, // Subscription value to receive the InputShowStateChanged high-volume event.
  SceneItemTransformChanged: 1 << 19, // Subscription value to receive the SceneItemTransformChanged high-volume event.
} as const;

interface WebsocketInboundMessage<T> {
  op: number;
  d: T;
}

type Authentication = {
  challenge: string;
  salt: string;
};

/**
 * Hello, Op-Code: 0
 * Sent from: obs-websocket
 * Sent to: Freshly connected websocket client
 * Description: First message sent from the server immediately on client connection.
 * Contains authentication information if auth is required. Also contains RPC version for version negotiation.
 */
type HelloMessage = WebsocketInboundMessage<{
  obsWebSocketVersion: number;
  rpcVersion: string;
  authentication?: Authentication;
}>;

/**
 * Identify, Op-Code: 1
 * Sent from: Freshly connected websocket client
 * Sent to: obs-websocket
 * Description: Response to Hello message, should contain authentication string if authentication is required,
 * along with PubSub subscriptions and other session parameters.
 */
type IdentifyMessage = WebsocketInboundMessage<{
  rpcVersion: number;
  authentication?: string;
  eventSubscriptions?: number;
}>;

/**
 * Identified, Op-Code: 2
 * Sent from: obs-websocket
 * Sent to: Freshly identified client
 * Description: The identify request was received and validated, and the connection is now ready for normal operation.
 */
type IdentifiedMessage = WebsocketInboundMessage<{
  negotiatedRpcVersion: number;
}>;

/**
 * Reidentify, Op-Code: 3
 * Sent from: Identified client
 * Sent to: obs-websocket
 * Description: Sent at any time after initial identification to update the provided session parameters.
 */
type ReidentifyMessage = WebsocketInboundMessage<{
  eventSubscriptions?: number;
}>;

/**
 * Event, Op-Code: 5
 * Sent from: obs-websocket
 * Sent to: All subscribed and identified clients
 * Description: An event coming from OBS has occured. Eg scene switched, source muted.
 */
type EventMessage = WebsocketInboundMessage<{
  eventType: string;
  eventIntent: number;
  eventData?: Record<string, unknown>;
}>;

/**
 * Request, Op-Code: 6
 * Sent from: Identified client
 * Sent to: obs-websocket
 * Description: An event coming from OBS has occured. Eg scene switched, source muted.
 */
type RequestMessage<T extends keyof Requests> = WebsocketInboundMessage<{
  requestType: T;
  requestId: string;
  requestData?: Requests[T];
}>;

/**
 * Request-Response, Op-Code: 7
 * Sent from: obs-websocket
 * Sent to: Identified client which made the request
 * Description: obs-websocket is responding to a request coming from a client.
 */
type RequestResponseMessage = WebsocketInboundMessage<{
  requestType: string;
  requestId: string;
  requestStatus: {
    result: boolean; // result is true if the request resulted in RequestStatus::Success. False if otherwise.
    code: number; // code is a RequestStatus code.
    comment?: string; // comment may be provided by the server on errors to offer further details on why a request failed.
  };
  responseData?: string;
}>;

/**
 * Request-Batch, Op-Code: 8
 * Sent from: Identified client
 * Sent to: obs-websocket
 * Description: Client is making a batch of requests for obs-websocket. Requests are processed serially (in order) by the server.
 */
type RequestBatchMessage = WebsocketInboundMessage<{
  requestId: string;
  haltOnFailure?: boolean; // When haltOnFailure is true, the processing of requests will be halted on first failure. Returns only the processed requests in RequestBatchResponse.
  executionType?: number; // RequestBatchExecutionType::SerialRealtime
  requests: Record<string, unknown>[];
}>;

/**
 * Request-Batch-Response, Op-Code: 9
 * Sent from: obs-websocket
 * Sent to: Identified client which made the request
 * Description: obs-websocket is responding to a request batch coming from the client.
 */
type RequestBatchResponseMessage = WebsocketInboundMessage<{
  requestId: string;
  results: Record<string, unknown>[];
}>;

type Responses = {
  GeneralRequests: {
    CallVendorRequest: {
      vendorName: string;
      requestType: string;
      responseData: Record<string, unknown>;
    };
  };
};

type Requests = {
  // GeneralRequests: {
  GetVersion: {
    obsVersion: string; // Current OBS Studio version
    obsWebSocketVersion: string; //	Current obs-websocket version
    rpcVersion: number; // Current latest obs-websocket RPC version
    availableRequests: string[]; // Array of available RPC requests for the currently negotiated RPC version
    supportedImageFormats: string[]; // Image formats available in GetSourceScreenshot and SaveSourceScreenshot requests.
    platform: string; // Name of the platform. Usually windows, macos, or ubuntu (linux flavor). Not guaranteed to be any of those
    platformDescription: string; //	Description of the platform, like Windows 10 (10.0)
  };
  GetStats: {
    cpuUsage: number; // Current CPU usage in percent
    memoryUsage: number; // Amount of memory in MB currently being used by OBS
    availableDiskSpace: number; // Available disk space on the device being used for recording storage
    activeFps: number; // Current FPS being rendered
    averageFrameRenderTime: number; // Average time in milliseconds that OBS is taking to render a frame
    renderSkippedFrames: number; // Number of frames skipped by OBS in the render thread
    renderTotalFrames: number; // Total number of frames outputted by the render thread
    outputSkippedFrames: number; // Number of frames skipped by OBS in the output thread
    outputTotalFrames: number; // Total number of frames outputted by the output thread
    webSocketSessionIncomingMessages: number; // Total number of messages received by obs-websocket from the client
    webSocketSessionOutgoingMessages: number; // Total number of messages sent by obs-websocket to the client
  };
  BroadcastCustomEvent: {
    eventData: Record<string, unknown>; // Custom event data
  };
  CallVendorRequest: {
    vendorName: string; // Name of the vendor to use
    requestType: string; // The request type to call
    requestData?: Record<string, unknown>; // Object containing appropriate request data
  };
  GetHotkeyList: {
    hotkeys: string[]; // Array of hotkey names;
  };
  TriggerHotkeyByName: {
    hotkeyName: string; // Name of the hotkey to trigger
    contextName?: string; // Name of context of the hotkey to trigger
  };
  TriggerHotkeyByKeySequence: {
    keyId?: string; //	The OBS key ID to use. See https://github.com/obsproject/obs-studio/blob/master/libobs/obs-hotkeys.h	None	Not pressed
    keyModifiers?: {
      // Object containing key modifiers to apply
      shift: boolean; //	Press Shift	None	Not pressed
      control: boolean; //	Press CTRL	None	Not pressed
      alt: boolean; //	Press ALT	None	Not pressed
      command: boolean; //	Press CMD (Mac)	None	Not pressed
    };
  };
  Sleep: {
    sleepMillis?: number; // Number of milliseconds to sleep for (if SERIAL_REALTIME mode)	>= 0, <= 50000	Unknown
    sleepFrames?: number; // Number of frames to sleep for (if SERIAL_FRAME mode)	>= 0, <= 10000	Unknown
  };
  // };
  // ConfigRequests: {
  // GetPersistentData
  // SetPersistentData
  // GetSceneCollectionList
  // SetCurrentSceneCollection
  // CreateSceneCollection
  // GetProfileList
  // SetCurrentProfile
  // CreateProfile
  // RemoveProfile
  // GetProfileParameter
  // SetProfileParameter
  // GetVideoSettings
  // SetVideoSettings
  // GetStreamServiceSettings
  // SetStreamServiceSettings
  // GetRecordDirectory
  // SetRecordDirectory
  // };
  // SourcesRequests: {
  // GetSourceActive
  // GetSourceScreenshot
  // SaveSourceScreenshot
  // };
  // ScenesRequests: {
  // GetSceneList
  // GetGroupList
  // GetCurrentProgramScene
  // SetCurrentProgramScene
  // GetCurrentPreviewScene
  // SetCurrentPreviewScene
  // CreateScene
  // RemoveScene
  // SetSceneName
  // GetSceneSceneTransitionOverride
  // SetSceneSceneTransitionOverride
  // };
  // InputsRequests: {
  // GetInputList
  // GetInputKindList
  // GetSpecialInputs
  // CreateInput
  // RemoveInput
  // SetInputName
  // GetInputDefaultSettings
  GetInputSettings: {
    inputName: string; // Name of the input to get the settings of
    inputUuid?: string; // UUID of the input to get the settings of
  };
  SetInputSettings: {
    inputName: string; // Name of the input to set the settings of
    inputSettings: Record<string, unknown>; // Object of settings to apply
    overlay?: boolean; // true == apply the settings on top of existing ones, False == reset the input to its defaults, then apply settings.
    inputUuid?: string; // UUID of the input to set the settings of
  };
  // GetInputMute
  // SetInputMute
  // ToggleInputMute
  // GetInputVolume
  // SetInputVolume
  // GetInputAudioBalance
  // SetInputAudioBalance
  // GetInputAudioSyncOffset
  // SetInputAudioSyncOffset
  // GetInputAudioMonitorType
  // SetInputAudioMonitorType
  // GetInputAudioTracks
  // SetInputAudioTracks
  // GetInputPropertiesListPropertyItems
  // PressInputPropertiesButton
  // };
  // TransitionsRequests: {
  // GetTransitionKindList
  // GetSceneTransitionList
  // GetCurrentSceneTransition
  // SetCurrentSceneTransition
  // SetCurrentSceneTransitionDuration
  // SetCurrentSceneTransitionSettings
  // GetCurrentSceneTransitionCursor
  // TriggerStudioModeTransition
  // SetTBarPosition
  // };
  // FiltersRequests: {
  // GetSourceFilterKindList
  // GetSourceFilterList
  // GetSourceFilterDefaultSettings
  // CreateSourceFilter
  // RemoveSourceFilter
  // SetSourceFilterName
  // GetSourceFilter
  // SetSourceFilterIndex
  // SetSourceFilterSettings
  // SetSourceFilterEnabled
  // };
  // SceneItemsRequests: {
  // GetSceneItemList
  // GetGroupSceneItemList
  // GetSceneItemId
  // GetSceneItemSource
  // CreateSceneItem
  // RemoveSceneItem
  // DuplicateSceneItem
  // GetSceneItemTransform
  // SetSceneItemTransform
  GetSceneItemEnabled: {
    sceneName: string; // Name of the scene the item is in
    sceneUuid?: string; // UUID of the scene the item is in
    sceneItemId: number; // Numeric ID of the scene item
  };
  SetSceneItemEnabled: {
    sceneName: string; // Name of the scene the item is in
    sceneUuid?: string; // UUID of the scene the item is in
    sceneItemId: number; // Numeric ID of the scene item
    sceneItemEnabled: boolean; // New enable state of the scene item
  };
  // GetSceneItemLocked
  // SetSceneItemLocked
  // GetSceneItemIndex
  // SetSceneItemIndex
  // GetSceneItemBlendMode
  // SetSceneItemBlendMode
  // };
  // OutputsRequests: {
  // GetVirtualCamStatus
  // ToggleVirtualCam
  // StartVirtualCam
  // StopVirtualCam
  // GetReplayBufferStatus
  // ToggleReplayBuffer
  // StartReplayBuffer
  // StopReplayBuffer
  // SaveReplayBuffer
  // GetLastReplayBufferReplay
  // GetOutputList
  // GetOutputStatus
  // ToggleOutput
  // StartOutput
  // StopOutput
  // GetOutputSettings
  // SetOutputSettings
  // };
  // StreamRequests: {
  // GetStreamStatus
  // ToggleStream
  // StartStream
  // StopStream
  // SendStreamCaption
  // };
  // RecordRequests: {
  // GetRecordStatus
  // ToggleRecord
  // StartRecord
  // StopRecord
  // ToggleRecordPause
  // PauseRecord
  // ResumeRecord
  // };
  // MediaInputsRequests: {
  // GetMediaInputStatus
  // SetMediaInputCursor
  // OffsetMediaInputCursor
  // TriggerMediaInputAction
  // };
  // UiRequests: {
  // GetStudioModeEnabled
  // SetStudioModeEnabled
  // OpenInputPropertiesDialog
  // OpenInputFiltersDialog
  // OpenInputInteractDialog
  // GetMonitorList
  // OpenVideoMixProjector
  // OpenSourceProjector
  // };
};

let isConnected = false;

function createAuthenticationString(challenge: string, salt: string, password: string) {
  // To generate the authentication string, follow these steps:
  // Concatenate the websocket password with the salt provided by the server (password + salt)
  // Generate an SHA256 binary hash of the result and base64 encode it, known as a base64 secret.
  // Concatenate the base64 secret with the challenge sent by the server (base64_secret + challenge)
  // Generate a binary SHA256 hash of that result and base64 encode it. You now have your authentication string.
  const secret = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('base64');
  return crypto
    .createHash('sha256')
    .update(secret + challenge)
    .digest('base64');
}

function handleWebsocketEvent(eventType: string, eventData?: Record<string, unknown>) {
  switch (eventType) {
    // General Events
    case 'ExitStarted': {
      logger.debug('OBS WebSocket: Exit started');
      break;
    }
    case 'VendorEvent': {
      logger.debug('OBS WebSocket: Vendor event');
      break;
    }
    case 'CustomEvent': {
      logger.debug('OBS WebSocket: Custom event');
      break;
    }
    // Config Events
    case 'CurrentSceneCollectionChanging': {
      logger.debug('OBS WebSocket: Current scene collection changing');
      break;
    }
    case 'CurrentSceneCollectionChanged': {
      logger.debug('OBS WebSocket: Current scene collection changed');
      break;
    }
    case 'SceneCollectionListChanged': {
      logger.debug('OBS WebSocket: Scene collection list changed');
      break;
    }
    case 'CurrentProfileChanging': {
      logger.debug('OBS WebSocket: Current profile changing');
      break;
    }
    case 'CurrentProfileChanged': {
      logger.debug('OBS WebSocket: Current profile changed');
      break;
    }
    case 'ProfileListChanged': {
      logger.debug('OBS WebSocket: Profile list changed');
      break;
    }
    // Scenes Events
    case 'SceneCreated': {
      logger.debug('OBS WebSocket: Scene created');
      break;
    }
    case 'SceneRemoved': {
      logger.debug('OBS WebSocket: Scene removed');
      break;
    }
    case 'SceneNameChanged': {
      logger.debug('OBS WebSocket: Scene name changed');
      break;
    }
    case 'CurrentProgramSceneChanged': {
      logger.debug('OBS WebSocket: Current program scene changed');
      break;
    }
    case 'CurrentPreviewSceneChanged': {
      logger.debug('OBS WebSocket: Current preview scene changed');
      break;
    }
    case 'SceneListChanged': {
      logger.debug('OBS WebSocket: Scene list changed');
      break;
    }
    // Inputs Events
    case 'InputCreated': {
      logger.debug('OBS WebSocket: Input created');
      break;
    }
    case 'InputRemoved': {
      logger.debug('OBS WebSocket: Input removed');
      break;
    }
    case 'InputNameChanged': {
      logger.debug('OBS WebSocket: Input name changed');
      break;
    }
    case 'InputSettingsChanged': {
      logger.debug('OBS WebSocket: Input settings changed');
      break;
    }
    case 'InputActiveStateChanged': {
      logger.debug('OBS WebSocket: Input active state changed');
      break;
    }
    case 'InputShowStateChanged': {
      logger.debug('OBS WebSocket: Input show state changed');
      break;
    }
    case 'InputMuteStateChanged': {
      logger.debug('OBS WebSocket: Input mute state changed');
      break;
    }
    case 'InputVolumeChanged': {
      logger.debug('OBS WebSocket: Input volume changed');
      break;
    }
    case 'InputAudioBalanceChanged': {
      logger.debug('OBS WebSocket: Input audio balance changed');
      break;
    }
    case 'InputAudioSyncOffsetChanged': {
      logger.debug('OBS WebSocket: Input audio sync offset changed');
      break;
    }
    case 'InputAudioTracksChanged': {
      logger.debug('OBS WebSocket: Input audio tracks changed');
      break;
    }
    case 'InputAudioMonitorTypeChanged': {
      logger.debug('OBS WebSocket: Input audio monitor type changed');
      break;
    }
    case 'InputVolumeMeters': {
      logger.debug('OBS WebSocket: Input volume meters');
      break;
    }
    // Transitions Events
    case 'CurrentSceneTransitionChanged': {
      logger.debug('OBS WebSocket: Current scene transition changed');
      break;
    }
    case 'CurrentSceneTransitionDurationChanged': {
      logger.debug('OBS WebSocket: Current scene transition duration changed');
      break;
    }
    case 'SceneTransitionStarted': {
      logger.debug('OBS WebSocket: Scene transition started');
      break;
    }
    case 'SceneTransitionEnded': {
      logger.debug('OBS WebSocket: Scene transition ended');
      break;
    }
    case 'SceneTransitionVideoEnded': {
      logger.debug('OBS WebSocket: Scene transition video ended');
      break;
    }
    // Filters Events
    case 'SourceFilterListReindexed': {
      logger.debug('OBS WebSocket: Source filter list reindexed');
      break;
    }
    case 'SourceFilterCreated': {
      logger.debug('OBS WebSocket: Source filter created');
      break;
    }
    case 'SourceFilterRemoved': {
      logger.debug('OBS WebSocket: Source filter removed');
      break;
    }
    case 'SourceFilterNameChanged': {
      logger.debug('OBS WebSocket: Source filter name changed');
      break;
    }
    case 'SourceFilterSettingsChanged': {
      logger.debug('OBS WebSocket: Source filter settings changed');
      break;
    }
    case 'SourceFilterEnableStateChanged': {
      logger.debug('OBS WebSocket: Source filter enable state changed');
      break;
    }
    // Scene Items Events
    case 'SceneItemCreated': {
      logger.debug('OBS WebSocket: Scene item created');
      break;
    }
    case 'SceneItemRemoved': {
      logger.debug('OBS WebSocket: Scene item removed');
      break;
    }
    case 'SceneItemListReindexed': {
      logger.debug('OBS WebSocket: Scene item list reindexed');
      break;
    }
    case 'SceneItemEnableStateChanged': {
      // HINT: An example of using the data provided by the event, parsing it through zod.
      const data = z
        .object({
          sceneItemEnabled: z.boolean(),
          sceneItemId: z.number(),
          sceneName: z.string(),
          sceneUuid: z.string(),
        })
        .parse(eventData);
      logger.debug(`OBS WebSocket: Scene item enable state changed: "${data.sceneName}":${data.sceneItemId}:${data.sceneItemEnabled}`);
      break;
    }
    case 'SceneItemLockStateChanged': {
      logger.debug('OBS WebSocket: Scene item lock state changed');
      break;
    }
    case 'SceneItemSelected': {
      logger.debug('OBS WebSocket: Scene item selected');
      break;
    }
    case 'SceneItemTransformChanged': {
      logger.debug('OBS WebSocket: Scene item transform changed');
      break;
    }
    // Outputs Events
    case 'StreamStateChanged': {
      logger.debug('OBS WebSocket: Stream state changed');
      break;
    }
    case 'RecordStateChanged': {
      logger.debug('OBS WebSocket: Record state changed');
      break;
    }
    case 'ReplayBufferStateChanged': {
      logger.debug('OBS WebSocket: Replay buffer state changed');
      break;
    }
    case 'VirtualcamStateChanged': {
      logger.debug('OBS WebSocket: Virtual cam state changed');
      break;
    }
    case 'ReplayBufferSaved': {
      logger.debug('OBS WebSocket: Replay buffer saved');
      break;
    }
    // Media Inputs Events
    case 'MediaInputPlaybackStarted': {
      logger.debug('OBS WebSocket: Media input playback started');
      break;
    }
    case 'MediaInputPlaybackEnded': {
      logger.debug('OBS WebSocket: Media input playback ended');
      break;
    }
    case 'MediaInputActionTriggered': {
      logger.debug('OBS WebSocket: Media input action triggered');
      break;
    }
    // Ui Events
    case 'StudioModeStateChanged': {
      logger.debug('OBS WebSocket: Studio mode state changed');
      break;
    }
    case 'ScreenshotSaved': {
      logger.debug('OBS WebSocket: Screenshot saved');
      break;
    }
    default:
      logger.debug(`OBS WebSocket: Unknown event type ${eventType}`);
      break;
  }
}

function handleWebsocketCloseCode(code: number) {
  switch (code) {
    case WebSocketCloseCode.UnknownReason: {
      logger.error('OBS WebSocket: Unknown reason');
      break;
    }
    case WebSocketCloseCode.MessageDecodeError: {
      logger.error('OBS WebSocket: The server was unable to decode the incoming websocket message');
      break;
    }
    case WebSocketCloseCode.MissingDataField: {
      logger.error('OBS WebSocket: A data field is required but missing from the payload');
      break;
    }
    case WebSocketCloseCode.InvalidDataFieldType: {
      logger.error("OBS WebSocket: A data field's value type is invalid");
      break;
    }
    case WebSocketCloseCode.InvalidDataFieldValue: {
      logger.error("OBS WebSocket: A data field's value is invalid");
      break;
    }
    case WebSocketCloseCode.UnknownOpCode: {
      logger.error('OBS WebSocket: The specified op was invalid or missing');
      break;
    }
    case WebSocketCloseCode.NotIdentified: {
      logger.error('OBS WebSocket: The client sent a websocket message without first sending Identify message');
      break;
    }
    case WebSocketCloseCode.AlreadyIdentified: {
      logger.error('OBS WebSocket: The client sent an Identify message while already identified');
      break;
    }
    case WebSocketCloseCode.AuthenticationFailed: {
      logger.error('OBS WebSocket: The authentication attempt (via Identify) failed');
      break;
    }
    case WebSocketCloseCode.UnsupportedRpcVersion: {
      logger.error('OBS WebSocket: The server detected the usage of an old version of the obs-websocket RPC protocol');
      break;
    }
    case WebSocketCloseCode.SessionInvalidated: {
      logger.error('OBS WebSocket: The websocket session has been invalidated by the obs-websocket server');
      break;
    }
    case WebSocketCloseCode.UnsupportedFeature: {
      logger.error('OBS WebSocket: A requested feature is not supported due to hardware/software limitations');
      break;
    }
  }
}

function handleWebsocketOpCode(config: OBSConfig, op: number, d: unknown, connection: websocket.connection) {
  switch (op) {
    case WebsocketOpCodes.Hello: {
      isConnected = true;
      const { obsWebSocketVersion, rpcVersion, authentication } = d as HelloMessage['d'];
      logger.debug(`OBS WebSocket: Hello, OBS WebSocket version ${obsWebSocketVersion}, RPC version ${rpcVersion}`);
      if (authentication) {
        logger.debug(`OBS WebSocket: Authentication required`);
        const { challenge, salt } = authentication;

        const authenticationString = createAuthenticationString(challenge, salt, config.password);

        // rpcVersion is the version number that the client would like the obs-websocket server to use.
        // eventSubscriptions is a bitmask of EventSubscriptions items to subscribe to events and event categories at will.
        // By default, all event categories are subscribed, except for events marked as high volume. High volume events must be explicitly subscribed to.
        const identifyMessage: IdentifyMessage = {
          op: WebsocketOpCodes.Identify,
          d: { rpcVersion: Number(rpcVersion), authentication: authenticationString },
        };
        logger.debug(`OBS WebSocket: Sending Identify message`);
        connection.send(JSON.stringify(identifyMessage));
      }
      break;
    }
    case WebsocketOpCodes.Identified: {
      const { negotiatedRpcVersion } = d as IdentifiedMessage['d'];
      logger.debug(`OBS WebSocket: Identified with negotiated RPC version ${negotiatedRpcVersion}`);
      break;
    }
    case WebsocketOpCodes.Reidentify: {
      const { eventSubscriptions } = d as ReidentifyMessage['d'];
      logger.debug(`OBS WebSocket: Reidentify, event subscriptions: ${eventSubscriptions}`);
      break;
    }
    case WebsocketOpCodes.Event: {
      const { eventType, eventIntent, eventData } = d as EventMessage['d'];
      logger.debug(`OBS WebSocket: Event: ${eventType} (${eventIntent})`);
      handleWebsocketEvent(eventType, eventData);
      break;
    }
    case WebsocketOpCodes.RequestResponse: {
      const { requestType, requestId, requestStatus, responseData } = d as RequestResponseMessage['d'];
      logger.debug(`OBS WebSocket: Request Response: ${requestType} (${requestId})`);
      logger.debug(`OBS WebSocket: Request Status: ${JSON.stringify(requestStatus)}`);
      logger.debug(`OBS WebSocket: Response Data: ${JSON.stringify(responseData)}`);

      if (requestId) {
        const pendingRequest = pendingRequests.get(requestId);

        if (!pendingRequest) {
          logger.warn(`OBS WebSocket: Received a response for a request that does not exist: ${responseData}`);
          return;
        }

        const { resolve, reject } = pendingRequest;

        if (requestStatus.result === false) {
          reject(requestStatus.comment);
          return;
        }

        resolve(responseData);
        pendingRequests.delete(requestId);
      }
      break;
    }
    case WebsocketOpCodes.RequestBatch: {
      const { requestId, haltOnFailure, executionType, requests } = d as RequestBatchMessage['d'];
      logger.debug(`OBS WebSocket: Request Batch: ${requestId}`);
      logger.debug(JSON.stringify(haltOnFailure));
      logger.debug(JSON.stringify(executionType));
      logger.debug(JSON.stringify(requests));
      break;
    }
    case WebsocketOpCodes.RequestBatchResponse: {
      const { requestId, results } = d as RequestBatchResponseMessage['d'];
      logger.debug(`OBS WebSocket: Request Batch Response: ${requestId}`);
      logger.debug(JSON.stringify(results));
      break;
    }
  }
}

export function runOBSWebsocket(config: OBSConfig) {
  const client = new websocket.client();

  client.on('connectFailed', function (error: unknown) {
    logger.error(`OBS WebSocket: Connect Error: ${String(error)}`);
  });

  client.on('connect', function (connection) {
    logger.info('OBS WebSocket: Client Connected');

    // Store the connection ref so it can be exported
    connectionRef = connection;

    connection.on('error', function (error) {
      logger.error('OBS WebSocket: Connection Error: ' + error.toString());
    });

    connection.on('close', function () {
      isConnected = false;
      connectionRef = undefined;
      logger.info('OBS WebSocket: Connection Closed');
    });

    connection.on('message', function (message) {
      if (hasOwnProperty(message, 'utf8Data') && typeof message.utf8Data === 'string') {
        const data: unknown = JSON.parse(message.utf8Data);
        const { op, d } = data as WebsocketInboundMessage<unknown>;
        if (op >= WebsocketOpCodes.Hello && op <= WebsocketOpCodes.RequestBatchResponse) {
          handleWebsocketOpCode(config, op, d, connection);
          return;
        }
        if (op >= WebSocketCloseCode.UnknownReason && op <= WebSocketCloseCode.UnsupportedFeature) {
          handleWebsocketCloseCode(op);
          return;
        }
        logger.error(`OBS WebSocket: Unknown op code: ${op}`);
      }
    });
  });
  client.connect(config.url);
  setInterval(() => {
    if (!isConnected) {
      logger.info('OBS WebSocket: Connecting...');
      client.connect(config.url);
    }
  }, 10000);
}

// TODO: Add response types instead of unknown
export function sendRequest<T extends keyof Requests>(request: RequestMessage<T>['d']): Promise<unknown> {
  return new Promise((resolve, reject) => {
    pendingRequests.set(request.requestId, { resolve, reject });

    const obsWebSocket = getOBSWebSocketConnection();

    if (!obsWebSocket) {
      return;
    }

    obsWebSocket.send(
      JSON.stringify({
        op: 6,
        d: request,
      }),
      (err) => {
        if (err) {
          pendingRequests.delete(request.requestId);
          reject(err);
        }
      },
    );
  });
}
