<script>
  import { token, roomName } from "../stores.js";
  let name = "";

  async function handleSubmit() {
    const init = {
      body: JSON.stringify({
        identity: name,
        roomName
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      referrerPolicy: "no-referrer"
    };

    const response = await fetch(
      "https://mahogany-snail-6871.twil.io/token-creation",
      init
    );

    const result = await response.json();
    $token = result;
    name = '';
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="name">
      Display name:
      <br />
      <input type="text" id="name" name="name" bind:value={name} />
    </label>
  </div>
  <br />
  <div>
    <label for="roomName">
      Room to join:
      <br />
      <input type="text" id="roomName" name="roomName" bind:value={$roomName} />
    </label>
  </div>
  <br />
  <button type="submit">Join Video Chat</button>
</form>