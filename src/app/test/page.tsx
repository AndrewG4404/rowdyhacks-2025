export default function TestPage() {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'green' }}>✅ APP IS WORKING!</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        If you can see this, the app is running correctly.
      </p>
      <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Current Status:</h2>
        <ul>
          <li>✅ Next.js is running</li>
          <li>✅ React is working</li>
          <li>✅ Pages can render</li>
        </ul>
      </div>
      <a href="/" style={{ display: 'inline-block', marginTop: '20px', color: 'blue', textDecoration: 'underline' }}>
        Go back to home page
      </a>
    </div>
  );
}
