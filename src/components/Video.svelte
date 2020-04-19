<script>
    import { onMount } from 'svelte';

    export let user;
    let audioRef, videoRef;
    let audioTrack = null;
    let videoTrack = null;

    onMount(() => {
        // first, we need to get our tracks
        // from the user object
        audioTrack = Array.from(user.audioTracks.values())[0];
        videoTrack = Array.from(user.videoTracks.values())[0];
        console.log('local audioTrack is = ', audioTrack);
        console.log('local videoTrack is = ', videoTrack);
    });
</script>

<div>
    <h3>{user.identity}</h3>
    <div bind:this={audioRef}></div>
    <div bind:this={videoRef}></div>
</div>