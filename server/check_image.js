
import axios from 'axios';

async function checkImage() {
    const url = 'http://localhost:3000/uploads/1765247859281-874882214.JPG';
    try {
        const res = await axios.head(url);
        console.log('Status:', res.status);
        console.log('Headers:', res.headers);
    } catch (e) {
        console.error('Error accessing image:', e.message);
        if (e.response) {
            console.error('Response Status:', e.response.status);
        }
    }
}

checkImage();
