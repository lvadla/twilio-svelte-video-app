<script>
    import TwilioVideo from "twilio-video";

    import { onMount } from 'svelte';

    import { roomName, token } from "../stores"

    let videoWrapper;

    onMount(async () => {
        room = await TwilioVideo.connect(token, { name: roomName })
    })
</script>

<h1>ok we have received your token from the video service</h1>
<br />
<div bind:this={videoWrapper}>video goes here</div>