addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
 const { readable, writable } = new TransformStream();
  //const encoder = new TextEncoder();
  //const writer = writable.getWriter();
  let i=0;
  setInterval(() => {
    //writer.write(encoder.encode(`data: hello\n\n`));
    console.log('hhh'+i)
    //readable="iiii"
    i++
  }, 5000);

  return new Response(readable);
}