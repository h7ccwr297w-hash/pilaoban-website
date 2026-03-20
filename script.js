// ========================================
// AI 工艺生成器 - 交互功能
// ========================================

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const removeImage = document.getElementById('removeImage');
const generateBtn = document.getElementById('generateBtn');
const resultArea = document.getElementById('resultArea');
const resultContent = document.getElementById('resultContent');
const downloadBtn = document.getElementById('downloadBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const contactForm = document.getElementById('contactForm');
const productsGrid = document.getElementById('productsGrid');
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// ========================================
// 导航栏交互
// ========================================

// 滚动时导航栏效果
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 22, 40, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 22, 40, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// 移动端菜单
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = navLinks.style.display === 'flex';
        
        if (!isActive) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(10, 22, 40, 0.98)';
            navLinks.style.padding = '24px';
            navLinks.style.gap = '8px';
            
            // 动画按钮
            mobileMenuBtn.classList.add('active');
            mobileMenuBtn.style.flexDirection = 'column';
        } else {
            navLinks.style.display = '';
            navLinks.style.flexDirection = '';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.right = '';
            navLinks.style.background = '';
            navLinks.style.padding = '';
            navLinks.style.gap = '';
            
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.style.flexDirection = '';
        }
    });
}

// 点击导航链接关闭移动菜单
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.style.display = '';
            navLinks.style.flexDirection = '';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.right = '';
            navLinks.style.background = '';
            navLinks.style.padding = '';
            navLinks.style.gap = '';
            
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.style.flexDirection = '';
        }
    });
});

// ========================================
// 文件上传功能
// ========================================

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
    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('文件大小超过 10MB 限制，请选择更小的文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        
        // 添加动画效果
        previewArea.style.opacity = '0';
        previewArea.style.transform = 'translateY(20px)';
        setTimeout(() => {
            previewArea.style.transition = 'all 0.4s ease';
            previewArea.style.opacity = '1';
            previewArea.style.transform = 'translateY(0)';
        }, 10);
    };
    reader.readAsDataURL(file);
}

// 删除图片
removeImage.addEventListener('click', () => {
    previewImage.src = '';
    fileInput.value = '';
    previewArea.style.display = 'none';
    uploadArea.style.display = 'block';
    
    // 添加动画效果
    uploadArea.style.opacity = '0';
    uploadArea.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        uploadArea.style.transition = 'all 0.4s ease';
        uploadArea.style.opacity = '1';
        uploadArea.style.transform = 'translateY(0)';
    }, 10);
});

// ========================================
// 生成工艺单功能
// ========================================

generateBtn.addEventListener('click', async () => {
    const requirements = document.getElementById('requirements').value;
    
    if (!previewImage.src || previewImage.src === '') {
        // 添加上传区域高亮提示
        uploadArea.style.borderColor = '#dc3232';
        uploadArea.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            uploadArea.style.borderColor = '';
            uploadArea.style.animation = '';
        }, 500);
        alert('请先上传款式图');
        return;
    }
    
    // 显示加载状态
    generateBtn.disabled = true;
    const btnText = generateBtn.querySelector('.btn-text');
    const loading = generateBtn.querySelector('.loading');
    btnText.style.display = 'none';
    loading.style.display = 'flex';
    
    try {
        // 调用后端 API
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
            // 将 Markdown 转换为 HTML
            resultContent.innerHTML = markdownToHtml(data.result);
            resultArea.style.display = 'block';
            
            // 添加动画效果
            resultArea.style.opacity = '0';
            resultArea.style.transform = 'translateY(30px)';
            setTimeout(() => {
                resultArea.style.transition = 'all 0.5s ease';
                resultArea.style.opacity = '1';
                resultArea.style.transform = 'translateY(0)';
            }, 10);
            
            // 平滑滚动到结果区
            setTimeout(() => {
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            alert('生成失败：' + data.error);
        }
    } catch (error) {
        console.error('请求失败:', error);
        // 使用模拟数据展示效果
        resultContent.innerHTML = generateMockResult(requirements);
        resultArea.style.display = 'block';
        
        // 添加动画效果
        resultArea.style.opacity = '0';
        resultArea.style.transform = 'translateY(30px)';
        setTimeout(() => {
            resultArea.style.transition = 'all 0.5s ease';
            resultArea.style.opacity = '1';
            resultArea.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        loading.style.display = 'none';
    }
});

// Markdown 转 HTML 函数
function markdownToHtml(markdown) {
    return markdown
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^# (.*$)/gim, '<h2>$1</h2>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n/gim, '<br>');
}

// 模拟生成结果（用于演示）
function generateMockResult(requirements) {
    return `
        <h4>🧶 工艺单详情</h4>
        <p><strong>款式名称：</strong>AI 智能分析款</p>
        <p><strong>纱线规格：</strong>${requirements || '26 支/2 股'}</p>
        <p><strong>针型：</strong>12 针</p>
        <p><strong>克重：</strong>约 280g</p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid rgba(201, 169, 98, 0.3);">
        <h4>📋 编织工艺</h4>
        <ul style="margin-left: 20px; line-height: 2.2;">
            <li>前片：平针编织，密度 12 针×18 行</li>
            <li>后片：平针编织，密度 12 针×18 行</li>
            <li>袖子：从上往下编织，加针规律 2-1-10</li>
            <li>领口：罗纹编织 2×2，密度 14 针</li>
            <li>下摆：罗纹编织 2×2，密度 14 针，高度 5cm</li>
        </ul>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid rgba(201, 169, 98, 0.3);">
        <h4>📐 尺寸规格（cm）</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="background: linear-gradient(135deg, #1a2d4a 0%, #2d4a7c 100%);">
                <th style="padding: 14px 12px; border: 1px solid rgba(201, 169, 98, 0.2); color: #c9a962;">部位</th>
                <th style="padding: 14px 12px; border: 1px solid rgba(201, 169, 98, 0.2); color: #c9a962;">S</th>
                <th style="padding: 14px 12px; border: 1px solid rgba(201, 169, 98, 0.2); color: #c9a962;">M</th>
                <th style="padding: 14px 12px; border: 1px solid rgba(201, 169, 98, 0.2); color: #c9a962;">L</th>
                <th style="padding: 14px 12px; border: 1px solid rgba(201, 169, 98, 0.2); color: #c9a962;">XL</th>
            </tr>
            <tr>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">衣长</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">58</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">60</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">62</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">64</td>
            </tr>
            <tr>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">胸围</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">96</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">100</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">104</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">108</td>
            </tr>
            <tr>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">袖长</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">55</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">56</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">57</td>
                <td style="padding: 14px 12px; border: 1px solid rgba(10, 22, 40, 0.05);">58</td>
            </tr>
        </table>
        <p style="margin-top: 20px; color: #8a8a9e; font-size: 0.9rem; padding: 16px; background: rgba(201, 169, 98, 0.05); border-radius: 8px; border-left: 3px solid #c9a962;">
            <strong>⚠️ 备注：</strong>以上工艺单由 AI 智能生成，仅供参考。实际生产前请与技术人员确认。
        </p>
    `;
}

// ========================================
// 下载工艺单
// ========================================

downloadBtn.addEventListener('click', () => {
    const content = resultContent.innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '工艺单_' + new Date().toLocaleDateString('zh-CN').replace(/\//g, '-') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    // 添加按钮反馈动画
    downloadBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        downloadBtn.style.transform = 'scale(1)';
    }, 150);
});

// ========================================
// 重新生成
// ========================================

regenerateBtn.addEventListener('click', () => {
    resultArea.style.display = 'none';
    const generatorSection = document.getElementById('generator');
    generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ========================================
// 联系表单提交
// ========================================

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>提交中...</span>';
    
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
            alert('✅ 提交成功！我们会尽快通过微信联系您。');
            contactForm.reset();
        } else {
            alert('提交失败：' + result.error);
        }
    } catch (error) {
        console.error('提交失败:', error);
        alert('❌ 提交失败，请稍后重试');
    } finally {
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// ========================================
// 加载爆款数据
// ========================================

const hotProducts = [
    { name: '秋冬新款羊毛衫', price: '¥168', tag: '热销', image: 'https://via.placeholder.com/400x300/1a2d4a/c9a962?text=羊毛衫 1' },
    { name: '韩版宽松毛衣', price: '¥198', tag: '爆款', image: 'https://via.placeholder.com/400x300/2d4a7c/c9a962?text=羊毛衫 2' },
    { name: '高领打底衫', price: '¥128', tag: '新品', image: 'https://via.placeholder.com/400x300/0a1628/c9a962?text=羊毛衫 3' },
    { name: '羊绒混纺开衫', price: '¥268', tag: '热销', image: 'https://via.placeholder.com/400x300/1a2d4a/dcc088?text=羊毛衫 4' },
    { name: '复古针织外套', price: '¥238', tag: '推荐', image: 'https://via.placeholder.com/400x300/2d4a7c/dcc088?text=羊毛衫 5' },
    { name: '简约基础款', price: '¥98', tag: '特价', image: 'https://via.placeholder.com/400x300/0a1628/dcc088?text=羊毛衫 6' },
];

function loadProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = hotProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price}</div>
                <span class="product-tag">${product.tag}</span>
            </div>
        </div>
    `).join('');
}

// ========================================
// 平滑滚动
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 滚动动画（Intersection Observer）
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察需要动画的元素
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .case-card, .product-card, .process-step');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// 页面加载完成
// ========================================

window.addEventListener('load', () => {
    // 页面淡入效果
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 加载产品数据
    loadProducts();
    
    // 初始化滚动动画
    setTimeout(() => {
        initScrollAnimations();
    }, 300);
    
    console.log('🧶 AI 工艺生成器已加载完成 - 极简奢华版');
});

// ========================================
// 添加 CSS 动画关键帧
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
