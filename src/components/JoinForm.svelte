<script>
  import { token, roomName } from "../stores.js";
  import { notifier } from '@beyonk/svelte-notifications';
  let name = "";

  async function handleSubmit() {
    const init = {
      body: JSON.stringify({
        identity: name,
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
      name = '';
      notifier.info('a token has been provided for this room!');
    } catch (error) {
      console.error(error);
      notifier.danger(`There was a problem receiving your token. [${error}]`, 10000)
    }
  }
</script>

<style>
  form {
    width: 320px;
    padding: 2rem;
    background-color: #FFF;
    border: 0;
    border-radius: .375rem;
    box-shadow: 0 15px 45px -5px rgba(10, 16, 34, .15);
    margin: 0 auto;
  }

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
    border: 2px solid rgba(0, 0, 0, .15);
    border-radius: .25rem;
    background-color: var(--primary-color);
    color: #fff;
  }
</style>

<form on:submit|preventDefault={handleSubmit}>
  <div class="field">
    <label for="name">
      Display name:
    </label>
    <input type="text" id="name" name="name" bind:value={name} required />
  </div>
  <br />
  <div class="field">
    <label for="roomName">
      Room to join:
    </label>
    <input type="text" id="roomName" name="roomName" bind:value={$roomName} required />
  </div>
  <br />
  <button type="submit">Join Video Chat</button>
</form>