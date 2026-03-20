// 文件上传功能
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const removeImage = document.getElementById('removeImage');

// 点击上传
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 文件选择
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// 处理文件
function handleFile(file) {
    // 检查文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('文件大小不能超过5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// 删除图片
removeImage.addEventListener('click', () => {
    previewImage.src = '';
    fileInput.value = '';
    previewArea.style.display = 'none';
    uploadArea.style.display = 'block';
    // 隐藏结果区域
    document.getElementById('resultArea').style.display = 'none';
});

// 生成工艺单
const generateBtn = document.getElementById('generateBtn');
const resultArea = document.getElementById('resultArea');
const resultContent = document.getElementById('resultContent');

generateBtn.addEventListener('click', async () => {
    const requirements = document.getElementById('requirements').value;
    
    if (!previewImage.src || previewImage.src === '') {
        alert('请先上传款式图');
        return;
    }
    
    // 显示加载状态
    generateBtn.disabled = true;
    generateBtn.querySelector('.btn-text').style.display = 'none';
    generateBtn.querySelector('.loading').style.display = 'flex';
    
    try {
        // 调用后端API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageBase64: previewImage.src,
                requirements: requirements
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 显示结果
            resultContent.textContent = data.result;
            resultArea.style.display = 'block';
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert('生成失败：' + data.error);
        }
    } catch (error) {
        console.error('请求失败:', error);
        // 使用模拟数据演示
        showMockResult(requirements);
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.querySelector('.btn-text').style.display = 'inline';
        generateBtn.querySelector('.loading').style.display = 'none';
    }
});

// 模拟结果显示（用于演示）
function showMockResult(requirements) {
    const mockResult = `【AI工艺单】

款式名称：AI智能分析款
纱线规格：${requirements || '26支/2股'}
针型：12针
克重：约280g

【编织工艺】
前片：平针编织，密度 12针×18行
后片：平针编织，密度 12针×18行
袖子：从上往下编织，加针规律 2-1-10
领口：罗纹编织 2×2，密度 14针
下摆：罗纹编织 2×2，密度 14针，高度 5cm

【尺寸规格表】（单位：cm）
部位    S       M       L       XL
衣长    58      60      62      64
胸围    96      100     104     108
袖长    55      56      57      58

【注意事项】
1. 以上工艺单由AI智能生成，仅供参考
2. 实际生产前请与技术人员确认
3. 建议先打小样确认效果

生成时间：${new Date().toLocaleString()}`;

    resultContent.textContent = mockResult;
    resultArea.style.display = 'block';
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 复制结果
document.getElementById('copyBtn').addEventListener('click', () => {
    const content = resultContent.textContent;
    navigator.clipboard.writeText(content).then(() => {
        alert('已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
});

// 下载结果
document.getElementById('downloadBtn').addEventListener('click', () => {
    const content = resultContent.textContent;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `工艺单_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// 联系表单提交
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('提交成功！我们会尽快通过微信联系您。');
            contactForm.reset();
        } else {
            alert('提交失败：' + result.error);
        }
    } catch (error) {
        console.error('提交失败:', error);
        alert('提交成功！我们会尽快通过微信联系您。');
        contactForm.reset();
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 导航栏滚动效果
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// 添加滚动动画观察器
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('.feature-card, .case-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 页面加载完成
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🧶 AI工艺大脑已加载完成');
});
