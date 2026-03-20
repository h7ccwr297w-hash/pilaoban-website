// AI工艺单生成API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, requirements } = req.body;

    // 调用OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "你是一位专业的羊毛衫工艺师，擅长根据图片和需求生成详细的工艺单。请用中文回复，包含：纱线规格、针型、编织工艺、尺寸规格表等。"
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `请根据这张款式图生成工艺单。需求：${requirements || '标准秋冬款，26支/2股纱线，12针'}

请按以下格式输出：
1. 款式名称
2. 纱线规格
3. 针型
4. 克重
5. 编织工艺（前片、后片、袖子、领口、下摆）
6. 尺寸规格表（S/M/L/XL的衣长、胸围、袖长）
7. 注意事项`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    res.status(200).json({
      success: true,
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error('生成失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
