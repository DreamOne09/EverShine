// ============================================
// 星空背景診斷工具
// ============================================

function debugStarrySky() {
    console.log('=== 星空背景診斷 ===');
    
    // 1. 檢查容器
    const container = document.querySelector('.starry-background-container');
    if (!container) {
        console.error('❌ 找不到 .starry-background-container');
        return;
    }
    console.log('✅ 找到容器');
    
    const computed = window.getComputedStyle(container);
    console.log('容器樣式:', {
        zIndex: computed.zIndex,
        position: computed.position,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        background: computed.background,
        width: computed.width,
        height: computed.height
    });
    
    // 2. 檢查星星層
    const staticLayers = document.querySelectorAll('.static-stars-layer');
    console.log(`找到 ${staticLayers.length} 個靜態星星層`);
    
    staticLayers.forEach((layer, i) => {
        const layerComputed = window.getComputedStyle(layer);
        const boxShadow = layer.style.boxShadow || layerComputed.boxShadow;
        console.log(`靜態星星層 ${i}:`, {
            boxShadow: boxShadow ? `${boxShadow.substring(0, 100)}...` : '無',
            boxShadowLength: boxShadow ? boxShadow.length : 0,
            display: layerComputed.display,
            visibility: layerComputed.visibility,
            opacity: layerComputed.opacity,
            width: layerComputed.width,
            height: layerComputed.height
        });
    });
    
    const movingLayers = document.querySelectorAll('.moving-stars-layer');
    console.log(`找到 ${movingLayers.length} 個移動星星層`);
    
    movingLayers.forEach((layer, i) => {
        const layerComputed = window.getComputedStyle(layer);
        const boxShadow = layer.style.boxShadow || layerComputed.boxShadow;
        console.log(`移動星星層 ${i}:`, {
            boxShadow: boxShadow ? `${boxShadow.substring(0, 100)}...` : '無',
            boxShadowLength: boxShadow ? boxShadow.length : 0,
            display: layerComputed.display,
            visibility: layerComputed.visibility,
            opacity: layerComputed.opacity
        });
    });
    
    // 3. 檢查body背景
    const bodyComputed = window.getComputedStyle(document.body);
    console.log('Body 背景:', bodyComputed.backgroundColor);
    
    // 4. 檢查Canvas
    const canvas = document.getElementById('starrySkyCanvas');
    if (canvas) {
        console.log('✅ 找到 Canvas');
        const canvasComputed = window.getComputedStyle(canvas);
        console.log('Canvas 樣式:', {
            zIndex: canvasComputed.zIndex,
            display: canvasComputed.display,
            width: canvasComputed.width,
            height: canvasComputed.height
        });
    } else {
        console.warn('⚠️ 找不到 Canvas');
    }
    
    // 5. 檢查流星
    const shootingStars = document.querySelectorAll('.shooting-star');
    console.log(`找到 ${shootingStars.length} 顆流星`);
    
    console.log('=== 診斷完成 ===');
}

// 自動執行診斷（延遲確保初始化完成）
setTimeout(() => {
    debugStarrySky();
}, 1000);

// 導出到全局，方便手動調用
window.debugStarrySky = debugStarrySky;

