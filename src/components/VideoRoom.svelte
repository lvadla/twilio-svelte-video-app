<script>
  import TwilioVideo from "twilio-video";
  import { onMount } from "svelte";
  import { roomName, token } from "../stores";
  import Video from "../components/Video.svelte";

  let participants = [];
  let room = null;

  onMount(async () => {
    try {
      // try to use the token to connect to the given room name
      room = await TwilioVideo.connect($token, {
        video: true,
        audio: true,
        name: $roomName
      });
      console.log(`Connected to Room "${room.name}"`);

      // update local state given who is participating in chat room
      participants = Array.from(room.participants.values());

      // update local state as users join
      room.on("participantConnected", participant => {
        console.log(`A remote Participant connected: ${participant}`);
        participants = [...participants, participant];
      });
      // update local state as users leave
      room.on("participantDisconnected", participant => {
        console.log(`A remote participant has left the room: ${participant}`);
        participants = participants.filter(n => n !== participant);
      });
    } catch (error) {
      console.error(
        `Unable to connect to Room:
        [${error.message}]
        Try checking that your webcam is plugged in or that you have given your browser the correct permissions`
      );
    }
    // clean up the video room when destroyed
    return () => {
      if (room) {
        participants = [];
        room = null;
        room.removeAllListeners();
        room.disconnect();
      }
    };
  });

  function leaveChat() {
    // if the user elects to leave the chat,
    // we should wipe their token and room name.
    // this brings them back to the "Join Video Chat"
    // form where they enter new room credentials
    $token = "";
    $roomName = "";
  }
</script>

<h1>ok we have received your token from the video service</h1>
<br />
{#if !!room}
  <!-- show the local user's video first -->
  <Video user={room.localParticipant} />

  <!-- show the remote user's videos after -->
  {#each participants as participant}
    <Video user={participant} />
  {/each}
  <button on:click={leaveChat}>Leave Video Chat</button>
{/if}
