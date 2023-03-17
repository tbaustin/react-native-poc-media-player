// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.pauseInvoke": {
      type: "done.invoke.pauseInvoke";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.playInvoke": {
      type: "done.invoke.playInvoke";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.pauseInvoke": {
      type: "error.platform.pauseInvoke";
      data: unknown;
    };
    "error.platform.playInvoke": {
      type: "error.platform.playInvoke";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    pause: "done.invoke.pauseInvoke";
    play: "done.invoke.playInvoke";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    pause: "PAUSE";
    play: "PLAY";
  };
  matchesStates: "idle" | "pause" | "play";
  tags: never;
}
