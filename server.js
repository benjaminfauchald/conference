import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = 8000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/gpt', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || !image.startsWith('data:image')) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    const chat = await openai.chat.completions.create({
      "model": "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify the company based on this logo. Then describe what the company does and how Seven Peaks Software (offering UX/UI, mobile/web dev, cloud, and AI/ML services) can help them."
            },
            {
              type: "image_url",
              image_url: { url: image }
            }
          ]
        }
      ],
      max_tokens: 800
    });

    res.json({ result: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
