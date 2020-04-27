<script>
  import TwilioVideo from "twilio-video";
  import { notifier } from "@beyonk/svelte-notifications";
  import { onMount } from "svelte";
  import { roomName, token, userName } from "../stores";
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
      notifier.success(`Connected to Room "${room.name}"`, 10000);

      // update local state from room participants
      participants = Array.from(room.participants.values());

      // update local state as users join
      room.on("participantConnected", participant => {
        console.log(`A remote Participant connected: ${participant}`);
        notifier.success(
          `A remote participant connected: ${participant}`,
          10000
        );
        participants = [...participants, participant];
      });
      // update local state as users leave
      room.on("participantDisconnected", participant => {
        console.log(`A remote participant has left the room: ${participant}`);
        notifier.warning(
          `A remote participant has left the room: ${participant}`,
          10000
        );
        participants = participants.filter(n => n !== participant);
      });
    } catch (error) {
      console.error(
        `Unable to connect to Room:
        [${error.message}]
        Try checking that your webcam is plugged in or that you have given your browser the correct permissions`
      );
      notifier.danger(
        "Error! Unable to connect. Try checking that your webcam is plugged in or that you have given your browser the correct permissions",
        10000
      );
    }

    // clean up the video room when destroyed
    return () => {
      leaveChat();
    };
  });

  function leaveChat() {
    // if the user elects to leave the chat,
    // we should wipe their token and room name.
    // this brings them back to the "Join Video Chat"
    // form where they enter new room credentials
    notifier.info(`you have left the room "${$roomName}"`);
    tearDownRoom();
    $token = "";
    $roomName = "";
    $userName = "";
  }

  function tearDownRoom() {
    if (room) {
      room.removeAllListeners();
      room.disconnect();
      room = null;
      participants = [];
    }
  }
</script>

<style>
  img {
    width: 100%;
    height: auto;
    max-width: 400px;
  }

  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 10px;
  }
</style>

<br />
<h3>
  This is your virtual chat room that you can share with friends or family. Just
  make sure they join the right room! Again, this room is called
  <code>{$roomName}</code>
  . Go ahead and share it with anyone you'd like to chat with!
</h3>
<br />

<div class="wrapper">
  <div class="local" id={room && room.localParticipant.sid}>
    {#if !!room}
      <!-- show the local user's video first -->
      <Video user={room.localParticipant} />
    {:else}
      <p>we were unable to find your webcam feed. check your permissions!</p>
      <img alt="no video found" src="undraw_no_data_qbuo.svg" />
    {/if}
  </div>

  {#if !!room}
    {#each participants as participant}
      <div class="remote">
        <Video user={participant} />
      </div>
    {/each}
  {/if}
</div>

<button on:click={leaveChat}>Leave Video Chat</button>
