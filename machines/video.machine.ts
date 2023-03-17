import { Video } from "expo-av";
import { assign, createMachine } from "xstate";

export interface VideoContext {
  ref: React.MutableRefObject<Video>;
}

export type VideoEvents = { type: "PLAY" } | { type: "PAUSE" };

export type MachineArgs = {
  ref: React.MutableRefObject<Video>;
};

export const createVideoMachine = ({ ref }: MachineArgs) =>
  createMachine(
    {
      tsTypes: {} as import("./video.machine.typegen").Typegen0,
      schema: {
        context: {} as VideoContext,
        events: {} as VideoEvents,
      },
      id: "searchMachine",
      predictableActionArguments: true,
      initial: "idle",
      context: {
        ref,
      },
      states: {
        idle: {
          on: {
            PLAY: {
              target: "play",
            },
            PAUSE: {
              target: "pause",
            },
          },
        },
        play: {
          invoke: {
            id: "playInvoke",
            src: "play",
            onDone: {
              target: "idle",
            },
            onError: {
              target: "idle",
            },
          },
        },
        pause: {
          invoke: {
            id: "pauseInvoke",
            src: "pause",
            onDone: {
              target: "idle",
            },
            onError: {
              target: "idle",
            },
          },
        },
      },
    },
    {
      services: {
        play: async (ctx) => {
          const { ref } = ctx;
          try {
            const status = await ref.current.playAsync();
            console.log(`Status: `, status);
          } catch (e) {
            console.log(`Error playing video: `, e);
          }
        },
        pause: async (ctx) => {
          const { ref } = ctx;
          try {
            const status = await ref.current.pauseAsync();
            console.log(`Status: `, status);
          } catch (e) {
            console.log(`Error pausing video: `, e);
          }
        },
      },
    }
  );
