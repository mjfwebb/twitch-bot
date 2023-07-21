import { FileManager } from '../fileManager';
import { logger } from '../logger';
import { hasOwnProperty } from '../utils/hasOwnProperty';

export interface ChannelPointRedeem {
  title: string; // title of the redeem, should be unique and exactly match the title of the reward in twitch
  id: string; // id of the redeem, should be unique and exactly match the id of the reward in twitch
  timesUsed: number; // number of times the redeem has been used
  actions: {
    message: string; // message to send to chat when the redeem is used, can include all the same variables as command message
    command: string; // command to run when the redeem is used
    commandParams: string; // command to run when the redeem is used,
    onStatus: 'fulfilled' | 'unfulfilled'; // Only run the channel point redeem if the event that triggered it was a fullfillment
  }[];
}

const channelPointRedeemProperties = ['title', 'id', 'timesUsed', 'actions'];
const channelPointRedeemActionProperties = ['message', 'command', 'commandParams', 'onStatus'];

const fileName = 'channelPointRedeems.json';

const channelPointRedeemValidator = (data: unknown): data is ChannelPointRedeem[] => {
  if (Array.isArray(data)) {
    return data.every((channelPointRedeem: unknown) => {
      if (typeof channelPointRedeem !== 'object') {
        return false;
      }

      for (const property of [...channelPointRedeemProperties]) {
        if (hasOwnProperty(channelPointRedeem, property)) {
          switch (property) {
            case 'title':
              if (typeof channelPointRedeem.title !== 'string') {
                logger.error(`Invalid channel point redeem format, property ${property} must be a string`);
                return false;
              }
              break;
            case 'id':
              if (typeof channelPointRedeem.id !== 'string') {
                logger.error(`Invalid channel point redeem format, property ${property} must be a string`);
                return false;
              }
              break;
            case 'timesUsed':
              if (typeof channelPointRedeem.timesUsed !== 'number') {
                logger.error(`Invalid channel point redeem format, property ${property} must be a number`);
                return false;
              }
              break;
            case 'actions':
              if (!Array.isArray(channelPointRedeem.actions)) {
                logger.error(`Invalid channel point redeem format, property ${property} must be an array`);
                return false;
              }
              if (!channelPointRedeem.actions.every((action: unknown) => typeof action === 'object')) {
                logger.error(`Invalid channel point redeem format, property ${property} must be an array of objects`);
                return false;
              }
              if (
                !channelPointRedeem.actions.every((action: unknown) =>
                  channelPointRedeemActionProperties.every((actionProperty) => hasOwnProperty(action, actionProperty)),
                )
              ) {
                logger.error(`Invalid channel point redeem format, property ${property} must be an array of objects`);
                return false;
              }
              break;
            default:
              logger.error(`Invalid channel point redeem format, unknown property ${property}`);
              return false;
          }
        } else {
          logger.error(`Invalid channel point redeem format, missing property ${property}`);
          return false;
        }
      }

      return true;
    });
  }
  return false;
};

export class ChannelPointRedeemModel {
  private static instance: ChannelPointRedeemModel;

  private fileManager: FileManager<ChannelPointRedeem[]>;
  private channelPointRedeems: ChannelPointRedeem[] = [];
  constructor() {
    this.fileManager = new FileManager(fileName, channelPointRedeemValidator);
    this.channelPointRedeems = this.fileManager.loadData();
  }

  public static getInstance(): ChannelPointRedeemModel {
    if (!ChannelPointRedeemModel.instance) {
      ChannelPointRedeemModel.instance = new ChannelPointRedeemModel();
    }
    return ChannelPointRedeemModel.instance;
  }

  get data(): ChannelPointRedeem[] {
    return this.channelPointRedeems;
  }

  public findOneById(id: string): ChannelPointRedeem | null {
    const channelPointRedeem = this.channelPointRedeems.find((channelPointRedeem) => channelPointRedeem.id === id);
    if (!channelPointRedeem) {
      return null;
    }
    return channelPointRedeem;
  }

  public findOneByTitle(title: string, regexMatch?: RegExp): ChannelPointRedeem | null {
    if (regexMatch) {
      const channelPointRedeemsFound = this.channelPointRedeems.filter((channelPointRedeem) => channelPointRedeem.title.match(regexMatch));
      if (channelPointRedeemsFound.length === 0) {
        return null;
      }
      return channelPointRedeemsFound[0];
    }

    const channelPointRedeemsFound = this.channelPointRedeems.find((channelPointRedeem) => channelPointRedeem.title === title);
    if (!channelPointRedeemsFound) {
      return null;
    }
    return channelPointRedeemsFound;
  }

  public increaseTimesUsed(channelPointRedeem: ChannelPointRedeem): void {
    const index = this.channelPointRedeems.findIndex((u) => u.id === channelPointRedeem.id);
    if (index !== -1) {
      this.channelPointRedeems[index].timesUsed++;
      this.fileManager.saveData(this.channelPointRedeems);
    } else {
      logger.error(`Unable to increase times used: channel point redeem "${channelPointRedeem.title}" not found`);
    }
  }
}

export const ChannelPointRedeems = ChannelPointRedeemModel.getInstance();
