// Example messages taken from https://dev.twitch.tv/docs/irc/tags

/* eslint-disable max-len */
import { describe, expect, test } from 'vitest';

import { parseMessage } from './parseMessage';

describe('parseTags', () => {
  describe('first PRIVMSG test message', () => {
    const message =
      '@badge-info=;badges=staff/1,bits/1000;bits=100;color=;display-name=ronni;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=12345678;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=12345678;user-type=staff :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #ronni :cheer100';
    const parsedMessage = parseMessage(message);
    test('should have 100 bits', () => {
      expect(parsedMessage?.tags?.bits).toEqual('100');
    });
    test('should have user-type staff', () => {
      expect(parsedMessage?.tags?.['user-type']).toEqual('staff');
    });
    test('should have user-id 12345678', () => {
      expect(parsedMessage?.tags?.['user-id']).toEqual('12345678');
    });
    test('should have tmi-sent-ts 1507246572675', () => {
      expect(parsedMessage?.tags?.['tmi-sent-ts']).toEqual('1507246572675');
    });
  });
  describe('second PRIVMSG test message', () => {
    const message =
      '@badge-info=;badges=turbo/1;color=#0D4200;display-name=ronni;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #ronni :Kappa Keepo Kappa';
    const parsedMessage = parseMessage(message);
    test('should have turbo property', () => {
      expect(parsedMessage?.tags?.turbo).toEqual('1');
    });
    test('should have user-type global_mod', () => {
      expect(parsedMessage?.tags?.['user-type']).toEqual('global_mod');
    });
    test('should have user-id 1337', () => {
      expect(parsedMessage?.tags?.['user-id']).toEqual('1337');
    });
    test('should have tmi-sent-ts 1507246572675', () => {
      expect(parsedMessage?.tags?.['tmi-sent-ts']).toEqual('1507246572675');
    });
  });
  describe('third PRIVMSG test message', () => {
    const message =
      '@badge-info=;badges=vip/1,partner/1;client-nonce=cd15335a5e2059c3b087e22612de485e;color=;display-name=fun2bfun;emotes=;first-msg=0;flags=;id=1fd20412-965f-4c96-beb3-52266448f564;mod=0;returning-chatter=0;room-id=102336968;subscriber=0;tmi-sent-ts=1661372052425;turbo=0;user-id=12345678;user-type=;vip=1 PRIVMSG #ronni test';
    const parsedMessage = parseMessage(message);
    test('should have vip property', () => {
      expect(parsedMessage?.tags?.vip).toEqual('1');
    });
    test('should have false turbo property', () => {
      expect(parsedMessage?.tags?.turbo).toEqual('0');
    });
    test('should have empty (normal user) user-type', () => {
      expect(parsedMessage?.tags?.['user-type']).toBeNull();
    });
    test('should have room-id 102336968', () => {
      expect(parsedMessage?.tags?.['room-id']).toEqual('102336968');
    });
    test('should have user-id 12345678', () => {
      expect(parsedMessage?.tags?.['user-id']).toEqual('12345678');
    });
    test('should have tmi-sent-ts 1661372052425', () => {
      expect(parsedMessage?.tags?.['tmi-sent-ts']).toEqual('1661372052425');
    });
  });
  describe('fourth PRIVMSG test message', () => {
    const message = '@reply-parent-msg-id=b34ccfc7-4977-403a-8a94-33c6bac34fb8 PRIVMSG #ronni :Good idea!';
    const parsedMessage = parseMessage(message);
    test('should be a have a reply-parent-msg-id tag', () => {
      expect(parsedMessage?.tags?.['reply-parent-msg-id']).toEqual('b34ccfc7-4977-403a-8a94-33c6bac34fb8');
    });
  });
  describe('action PRIVMSG test message', () => {
    const message =
      '@badge-info=subscriber/24;badges=broadcaster/1,subscriber/12,game-developer/1;color=#5052B2;display-name=Athano;emotes=;first-msg=0;flags=;id=33bcfbc3-87b1-44ad-bf3c-48d4ddb970f7;mod=0;returning-chatter=0;room-id=30458956;subscriber=1;tmi-sent-ts=1687641213092;turbo=0;user-id=30458956;user-type= :athano!athano@athano.tmi.twitch.tv PRIVMSG #athano :\x01ACTION does a thing\x01';
    const parsedMessage = parseMessage(message);
    test('should have action property', () => {
      expect(parsedMessage?.command?.botCommand).toEqual('ACTION');
      expect(parsedMessage?.command?.botCommandParams).toEqual('does a thing');
    });
  });
  describe('first NOTICE test message', () => {
    const message = '@msg-id=delete_message_success :tmi.twitch.tv NOTICE #bar :The message from foo is now deleted.';
    const parsedMessage = parseMessage(message);
    test('should have msg-id property', () => {
      expect(parsedMessage?.tags?.['msg-id']).toEqual('delete_message_success');
    });
  });
  describe('second NOTICE test message', () => {
    const message =
      '@msg-id=whisper_restricted;target-user-id=12345678 :tmi.twitch.tv NOTICE #bar :Your settings prevent you from sending this whisper.';
    const parsedMessage = parseMessage(message);
    test('should have msg-id property', () => {
      expect(parsedMessage?.tags?.['msg-id']).toEqual('whisper_restricted');
    });
    test('should have target-user-id property', () => {
      expect(parsedMessage?.tags?.['target-user-id']).toEqual('12345678');
    });
  });
  describe('GLOBALUSERSTATE test message', () => {
    const message =
      '@badge-info=subscriber/8;badges=subscriber/6;color=#0D4200;display-name=dallas;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;turbo=0;user-id=12345678;user-type=admin :tmi.twitch.tv GLOBALUSERSTATE';
    const parsedMessage = parseMessage(message);
    test('should have false turbo property', () => {
      expect(parsedMessage?.tags?.turbo).toEqual('0');
    });
    test('should have emote-sets', () => {
      expect(parsedMessage?.tags?.['emote-sets']).toEqual(['0', '33', '50', '237', '793', '2126', '3517', '4578', '5569', '9400', '10337', '12239']);
    });
    test('should have color #0D4200', () => {
      expect(parsedMessage?.tags?.color).toEqual('#0D4200');
    });
    test('should have user-type admin', () => {
      expect(parsedMessage?.tags?.['user-type']).toEqual('admin');
    });
    test('should have display-name dallas', () => {
      expect(parsedMessage?.tags?.['display-name']).toEqual('dallas');
    });
    test('should have user-id 12345678', () => {
      expect(parsedMessage?.tags?.['user-id']).toEqual('12345678');
    });
  });
  describe('USERNOTICE test message', () => {
    const message =
      // eslint-disable-next-line prettier/prettier, no-useless-escape
    '@badge-info=;badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni;emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-cumulative-months=6;msg-param-streak-months=2;msg-param-should-share-streak=1;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=12345678;subscriber=1;system-msg=ronni\shas\ssubscribed\sfor\s6\smonths!;tmi-sent-ts=1507246572675;turbo=1;user-id=87654321;user-type=staff :tmi.twitch.tv USERNOTICE #dallas :Great stream -- keep it up!';
    const parsedMessage = parseMessage(message);
    test('should have turbo property', () => {
      expect(parsedMessage?.tags?.turbo).toEqual('1');
    });
    test('should have display-name ronni', () => {
      expect(parsedMessage?.tags?.['display-name']).toEqual('ronni');
    });
    test('should have msg-param-should-share-streak 1', () => {
      expect(parsedMessage?.tags?.['msg-param-should-share-streak']).toEqual('1');
    });
    test('should have msg-param-cumulative-months 6', () => {
      expect(parsedMessage?.tags?.['msg-param-cumulative-months']).toEqual('6');
    });
    test('should have color msg-param-sub-plan Prime', () => {
      expect(parsedMessage?.tags?.['msg-param-sub-plan']).toEqual('Prime');
    });
    test('should have color msg-param-sub-plan-name Prime', () => {
      expect(parsedMessage?.tags?.['msg-param-sub-plan-name']).toEqual('Prime');
    });
    test('should have user-type staff', () => {
      expect(parsedMessage?.tags?.['user-type']).toEqual('staff');
    });
    test('should have user-id 87654321', () => {
      expect(parsedMessage?.tags?.['user-id']).toEqual('87654321');
    });
  });
  describe('USERSTATE test message', () => {
    const message =
      '@badge-info=;badges=staff/1;color=#0D4200;display-name=ronni;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;mod=1;subscriber=1;turbo=1;user-type=staff :tmi.twitch.tv USERSTATE #dallas';
    const parsedMessage = parseMessage(message);
    test('should have turbo property', () => {
      expect(parsedMessage?.tags?.turbo).toEqual('1');
    });
    test('should have display-name ronni', () => {
      expect(parsedMessage?.tags?.['display-name']).toEqual('ronni');
    });
    test('should have user-type staff', () => {
      expect(parsedMessage?.tags?.['user-type']).toEqual('staff');
    });
  });
});
