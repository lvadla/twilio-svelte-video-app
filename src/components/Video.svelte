<script>
  import { onMount } from "svelte";

  export let user;
  let audioRef, videoRef;
  let audioTrack = null;
  let videoTrack = null;

  onMount(() => {
    // first, we need to get our track publications from the user object
    let audioPublication = Array.from(user.audioTracks.values())[0];
    let videoPublication = Array.from(user.videoTracks.values())[0];

    if (!!audioPublication.track) {
      audioTrack = audioPublication.track;
      audioTrack.attach(audioRef);
    }
    if (!!videoPublication.track) {
      videoTrack = videoPublication.track;
      videoTrack.attach(videoRef);
    }

    user.on("trackSubscribed", trackSubscribed);
    user.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      user.removeAllListeners();
      trackUnsubscribed(audioTrack);
      trackUnsubscribed(videoTrack);
      user = null;
    };
  });

  function trackSubscribed(track) {
    if (track.kind === "video") {
      videoTrack = track;
      track.attach(videoRef);
    }
    if (track.kind === "audio") {
      audioTrack = track;
      track.attach(audioRef);
    }
  }

  function trackUnsubscribed(track) {
    if (track && track.kind === "video" && track === videoTrack) {
      videoTrack.detach().forEach(n => n.remove());
      videoTrack = null;
    }
    if (track && track.kind === "audio" && track === audioTrack) {
      audioTrack.detach().forEach(n => n.remove());
      audioTrack = null;
    }
  }
</script>

<style>
  video {
    width: 100%;
  }

  h1 {
    font-weight: 500;
  }
</style>

{#if !!user}
  <div class="container" id={user.sid}>
    <h1>{user.identity}</h1>
    <audio bind:this={audioRef} />
    <video bind:this={videoRef} />
  </div>
{/if}
