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
    if (track.kind === "video" && track === videoTrack) {
      videoTrack.detach();
      videoTrack = null;
    }
    if (track.kind === "audio" && track === audioTrack) {
      audioTrack.detach();
      audioTrack = null;
    }
  }
</script>

{#if !!user}
  <div id={user.sid}>
    <h3>{user.identity}</h3>
    <audio bind:this={audioRef} />
    <video bind:this={videoRef} />
  </div>
{/if}
