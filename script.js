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
    generateBtn.querySelector('.loading').style.display = 'inline';
    
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
            // 将Markdown转换为HTML
            resultContent.innerHTML = markdownToHtml(data.result);
            resultArea.style.display = 'block';
            resultArea.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('生成失败：' + data.error);
        }
    } catch (error) {
        console.error('请求失败:', error);
        alert('请求失败，请稍后重试');
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.querySelector('.btn-text').style.display = 'inline';
        generateBtn.querySelector('.loading').style.display = 'none';
    }
});

// 简单的Markdown转HTML函数
function markdownToHtml(markdown) {
    return markdown
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^# (.*$)/gim, '<h2>$1</h2>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br>');
}

// 模拟生成结果
function generateMockResult(requirements) {
    return `
        <h4>🧶 工艺单详情</h4>
        <p><strong>款式名称：</strong>AI智能分析款</p>
        <p><strong>纱线规格：</strong>${requirements || '26支/2股'}</p>
        <p><strong>针型：</strong>12针</p>
        <p><strong>克重：</strong>约280g</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
        <h4>📋 编织工艺</h4>
        <ul style="margin-left: 20px; line-height: 2;">
            <li>前片：平针编织，密度 12针×18行</li>
            <li>后片：平针编织，密度 12针×18行</li>
            <li>袖子：从上往下编织，加针规律 2-1-10</li>
            <li>领口：罗纹编织 2×2，密度 14针</li>
            <li>下摆：罗纹编织 2×2，密度 14针，高度 5cm</li>
        </ul>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
        <h4>📐 尺寸规格（cm）</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #f0f0f0;">
                <th style="padding: 10px; border: 1px solid #ddd;">部位</th>
                <th style="padding: 10px; border: 1px solid #ddd;">S</th>
                <th style="padding: 10px; border: 1px solid #ddd;">M</th>
                <th style="padding: 10px; border: 1px solid #ddd;">L</th>
                <th style="padding: 10px; border: 1px solid #ddd;">XL</th>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">衣长</td>
                <td style="padding: 10px; border: 1px solid #ddd;">58</td>
                <td style="padding: 10px; border: 1px solid #ddd;">60</td>
                <td style="padding: 10px; border: 1px solid #ddd;">62</td>
                <td style="padding: 10px; border: 1px solid #ddd;">64</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">胸围</td>
                <td style="padding: 10px; border: 1px solid #ddd;">96</td>
                <td style="padding: 10px; border: 1px solid #ddd;">100</td>
                <td style="padding: 10px; border: 1px solid #ddd;">104</td>
                <td style="padding: 10px; border: 1px solid #ddd;">108</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">袖长</td>
                <td style="padding: 10px; border: 1px solid #ddd;">55</td>
                <td style="padding: 10px; border: 1px solid #ddd;">56</td>
                <td style="padding: 10px; border: 1px solid #ddd;">57</td>
                <td style="padding: 10px; border: 1px solid #ddd;">58</td>
            </tr>
        </table>
        <p style="margin-top: 15px; color: #666; font-size: 0.9rem;">
            <strong>备注：</strong>以上工艺单由AI智能生成，仅供参考。实际生产前请与技术人员确认。
        </p>
    `;
}

// 下载工艺单
document.getElementById('downloadBtn').addEventListener('click', () => {
    const content = resultContent.innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '工艺单_' + new Date().toLocaleDateString() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// 重新生成
document.getElementById('regenerateBtn').addEventListener('click', () => {
    resultArea.style.display = 'none';
    window.scrollTo({ top: document.getElementById('generator').offsetTop, behavior: 'smooth' });
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
        alert('提交失败，请稍后重试');
    }
});

// 加载爆款数据
const productsGrid = document.getElementById('productsGrid');
const hotProducts = [
    { name: '秋冬新款羊毛衫', price: '¥168', tag: '热销', image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=羊毛衫1' },
    { name: '韩版宽松毛衣', price: '¥198', tag: '爆款', image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=羊毛衫2' },
    { name: '高领打底衫', price: '¥128', tag: '新品', image: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=羊毛衫3' },
    { name: '羊绒混纺开衫', price: '¥268', tag: '热销', image: 'https://via.placeholder.com/300x200/4facfe/ffffff?text=羊毛衫4' },
    { name: '复古针织外套', price: '¥238', tag: '推荐', image: 'https://via.placeholder.com/300x200/43e97b/ffffff?text=羊毛衫5' },
    { name: '简约基础款', price: '¥98', tag: '特价', image: 'https://via.placeholder.com/300x200/feca57/ffffff?text=羊毛衫6' },
];

function loadProducts() {
    productsGrid.innerHTML = hotProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price}</div>
                <span class="product-tag">${product.tag}</span>
            </div>
        </div>
    `).join('');
}

loadProducts();

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

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🧶 AI工艺生成器已加载完成');
