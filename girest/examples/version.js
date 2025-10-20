/* Get the GStreamer version on the system
 * This proves the output parameters maechanism
 */

const getVersion = async () => {
  const response = await fetch("http://localhost:9000/Gst/version");
  const json = await response.json();
  console.log(json);
}

getVersion();
