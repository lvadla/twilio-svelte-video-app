<script>
  import { token } from "../stores.js";
  let name = "";
  let room = "";

  async function handleSubmit() {
    const init = {
      body: JSON.stringify({
        identity: name
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
    <label for="room">
      Room to join:
      <br />
      <input type="text" id="room" name="room" bind:value={room} />
    </label>
  </div>
  <br />
  <button type="submit">Join Video Chat</button>
</form>