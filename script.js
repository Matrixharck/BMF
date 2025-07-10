
document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = new FormData(e.target);

  const res = await fetch('http://localhost:3000/submit', {
    method: 'POST',
    body: form
  });

  const result = await res.json();
  document.getElementById("confirmation").textContent = result.message;
  if (res.ok) e.target.reset();
});
