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
    $token = "";
    $roomName = "";
    $userName = "";
    tearDownRoom();
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
  .local-video {
    max-width: 300px;
    padding: 2rem;
    background-color: #fff;
    border: 0;
    border-radius: 0.375rem;
    box-shadow: 0 15px 45px -5px rgba(10, 16, 34, 0.15);
    margin: 0 auto 2rem;
  }

  img {
    width: 100%;
  }
</style>

<br />
<div>
  <h2>Welcome to "{$roomName}"</h2>
  <p>
    This is your virtual chat room that you can share with friends or family.
    Just make sure they join the right room! Again, this room is called
    <code>{$roomName}</code>
    . Go ahead and share it with anyone you'd like to chat with!
  </p>
  <br />

  <div class="local-video" id={room.localParticipant.sid}>
    {#if !!room}
      <!-- show the local user's video first -->
      <Video user={room.localParticipant} />
    {:else}
      <p>we were unable to find your webcam feed. check your permissions!</p>
      <img alt="no video found" src="undraw_no_data_qbuo.svg" />
    {/if}
  </div>

  <button on:click={leaveChat}>Leave Video Chat</button>

  {#if !!room}
    <!-- show the remote user's videos after -->
    {#each participants as participant}
      <Video user={participant} />
    {/each}
  {/if}
</div>
