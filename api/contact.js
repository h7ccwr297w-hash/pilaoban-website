// 联系表单提交API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, wechat, description } = req.body;

    // 这里可以接入邮件服务或数据库
    // 示例：发送到邮箱或保存到数据库
    
    console.log('收到新咨询：', { name, wechat, description });

    // TODO: 接入邮件服务（如SendGrid、Resend）
    // TODO: 保存到数据库（如MongoDB、Supabase）

    res.status(200).json({
      success: true,
      message: '提交成功'
    });

  } catch (error) {
    console.error('提交失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
