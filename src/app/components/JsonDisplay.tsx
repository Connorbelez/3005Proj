import React from 'react';

function JsonDisplay({ jsonData }:{jsonData:JSON}) {
    console.log("JSON DATA: ",jsonData)
    console.table(jsonData)
    const data = JSON.stringify(jsonData)
    const j = JSON.parse(data)
    console.log("J: ",j)
    console.table(j)
    console.log("DATA: ",data)
    
    return (
    
        <div style={{ backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px", fontFamily: "Arial, sans-serif", color: "#333" }}>
            <h3>Exercise Routine Details</h3>
            <pre>
                <code>{JSON.stringify(jsonData, null, 2)}</code>
            </pre>
            {/* <ul>
                {Object.entries(jsonData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{formatKey(key)}:</strong> {formatValue(value)}
                    </li>
                ))}
            </ul> */}
        </div>
    );
}



export default JsonDisplay;
