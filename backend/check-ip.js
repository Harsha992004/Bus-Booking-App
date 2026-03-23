async function checkIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    console.log('\nYour Public IP is:', data.ip);
    console.log('\nPlease add this IP to your MongoDB Atlas Network Access Whitelist:');
    console.log('1. Go to MongoDB Atlas Dashboard');
    console.log('2. Click "Network Access" in the left sidebar');
    console.log('3. Click "Add IP Address"');
    console.log('4. Paste your IP or click "Add Current IP Address"');
    console.log('5. Save and wait a minute for it to apply.');
  } catch (error) {
    console.error('Error fetching IP:', error.message);
  }
}
checkIP();
