/**
 */
addEventListener('scheduled', event => {
  event.waitUntil(triggerEvent(event.scheduledTime));
});


async function triggerEvent(scheduledTime) {
  // Fetch some data
  // Update API
  console.log('cron processed');
}