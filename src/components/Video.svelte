<script>
  import { onMount } from "svelte";

  export let user;
  let audioRef, videoRef;
  let audioTrack = null;
  let videoTrack = null;

  onMount(() => {
    // first, we need to get our track publications from the user object
    let audioTrackPublication = Array.from(user.audioTracks.values())[0];
    let videoTrackPublication = Array.from(user.videoTracks.values())[0];

    if (!!audioTrackPublication.track) {
      audioTrack = audioTrackPublication.track;
      audioTrack.attach(audioRef);
    }
    if (!!videoTrackPublication.track) {
      videoTrack = videoTrackPublication.track;
      videoTrack.attach(videoRef);
    }

    user.on("trackSubscribed", trackSubscribed);
    user.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      user.removeAllListeners();
      trackUnsubscribed(audioTrack);
      trackUnsubscribed(videoTrack);
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

<div id={user.sid}>
  <h3>{user.identity}</h3>
  <audio bind:this={audioRef} />
  <video bind:this={videoRef} />
</div>
