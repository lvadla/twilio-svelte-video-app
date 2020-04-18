<script>
  import JoinForm from "../components/JoinForm.svelte";
  import Video from "../components/Video.svelte";

  import { time, token } from "../stores";

  const timeFormat = new Intl.DateTimeFormat("en", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
</script>

<style>
  h1 {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Video Chat from Twilio+Svelte</title>
</svelte:head>

<h1>The current time is {timeFormat.format($time)}</h1>

{#if !$token}
  <JoinForm />
{:else}
  <Video />
{/if}
