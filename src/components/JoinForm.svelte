<script>
  import { roomName, token, userName } from "../stores.js";
  import { notifier } from "@beyonk/svelte-notifications";

  async function handleSubmit() {
    const init = {
      body: JSON.stringify({
        identity: $userName,
        room: $roomName
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      referrerPolicy: "no-referrer"
    };

    try {
      const response = await fetch(
        "https://mahogany-snail-6871.twil.io/token-creation",
        init
      );

      const result = await response.json();
      $token = result.token;
      name = "";
      notifier.info("a token has been provided for this room!");
    } catch (error) {
      console.error(error);
      notifier.danger(
        `There was a problem receiving your token. [${error}]`,
        10000
      );
    }
  }
</script>

<style>
  .field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    min-height: 1.375rem;
  }

  label {
    flex: 0 1 45%;
  }

  input {
    display: block;
    flex: 1;
    padding: 0.5rem;
  }

  button {
    width: 100%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 1rem;
    border: 2px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    background-color: var(--primary-color);
    color: #fff;
  }
</style>

<div class="container">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="field">
      <label for="userName">Display name:</label>
      <input
        type="text"
        id="userName"
        name="userName"
        bind:value={$userName}
        required />
    </div>
    <br />
    <div class="field">
      <label for="roomName">Room to join:</label>
      <input
        type="text"
        id="roomName"
        name="roomName"
        bind:value={$roomName}
        required />
    </div>
    <br />
    <button type="submit">Join Video Chat</button>
  </form>
</div>
