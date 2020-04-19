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
  h1,
  h2 {
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
  <title>Chat Room</title>
</svelte:head>

<h1>video chat without the nonsense</h1>
<h2>The current time is <pre>{timeFormat.format($time)}</pre></h2>
<br />

{#if !$token}
  <JoinForm />
{:else}
  <Video />
{/if}
