gsap.registerPlugin(ScrollTrigger);

// Add more panels dynamically when reaching the end
const comicContainer = document.getElementById("comicContainer");
const totalPanels = 7; // Number of panels to begin with

// Function to dynamically add more panels
function addMorePanels() {
    let currentPanels = document.querySelectorAll('.comic-panel').length;
    if (currentPanels >= totalPanels) {
        for (let i = 0; i < totalPanels; i++) {
            let panelNumber = currentPanels + i + 1;
            let newPanel = document.createElement("img");
            newPanel.classList.add("comic-panel");
            newPanel.src = `F/F${panelNumber}.jpg`; // Use your real image paths here
            newPanel.alt = `Panel ${panelNumber}`;
            comicContainer.appendChild(newPanel);
        }
    }
}

// Adjust width dynamically based on the number of panels
function adjustContainerWidth() {
    const panelCount = document.querySelectorAll('.comic-panel').length;
    comicContainer.style.width = `${100 * panelCount}vw`;
}

// ScrollTrigger for opacity and scale effects
gsap.utils.toArray(".comic-panel").forEach((panel, index) => {
    gsap.to(panel, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: panel,
            start: "left 60%",
            scrub: false,
            horizontal: true,
            toggleActions: "play none none none",
            scroller: ".wrapper",
        }
    });
});

// Check scroll position to add more panels when scrolling near the end
window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollX + window.innerWidth;
    const containerWidth = comicContainer.offsetWidth;
    
    if (scrollPosition >= containerWidth - 100) {
        addMorePanels();
        adjustContainerWidth();
    }
});

const placeInput = document.getElementById('placeInput');
const actionInput = document.getElementById('actionInput');
const objectInput = document.getElementById('objectInput');
const madLibBg = document.getElementById('madLibBg');
const actionObjectImg = document.getElementById('actionObjectImg');

// 关键词映射表
const actionMap = {
    'drinking': 'A',
    'cutting': 'B',
    'coding': 'C'
};

const objectMap = {
    'latte': 'D',
    'poster': 'E',
    'website': 'F'
};

// 事件监听
placeInput.addEventListener('input', updateBackground);
actionInput.addEventListener('input', updateActionObject);
objectInput.addEventListener('input', updateActionObject);

// 背景更新函数 (无需更改)
function updateBackground(e) {
    const value = e.target.value.toLowerCase();
    if (value.includes('dining hall')) {
        madLibBg.src = "mad/B1.jpg";
        madLibBg.style.opacity = 1;
    } else if (value.includes('printing')) {
        madLibBg.src = "mad/B2.jpg";
        madLibBg.style.opacity = 1;
    } else if (value.includes('library')) {
        madLibBg.src = "mad/B3.jpg";
        madLibBg.style.opacity = 1;
    } else {
        madLibBg.style.opacity = 0;
    }
}

// 动作物品更新函数（更新为关键词逻辑）
function updateActionObject() {
    const actionVal = actionInput.value.trim().toLowerCase();
    const objectVal = objectInput.value.trim().toLowerCase();

    const actionKey = actionMap[actionVal] || '';
    const objectKey = objectMap[objectVal] || '';

    let imgSrc = '';

    if (actionKey && objectKey) {
        // 同时存在动作和物品
        imgSrc = `mad/XY/${actionKey}${objectKey}.png`;
    } else if (actionKey && !objectKey) {
        // 只有动作存在
        imgSrc = `mad/XY/${actionKey}.png`;
    } else if (!actionKey && objectKey) {
        // 只有物品存在
        imgSrc = `mad/XY/${objectKey}.png`;
    } else {
        actionObjectImg.style.opacity = 0;
        return;
    }

    actionObjectImg.src = imgSrc;
    actionObjectImg.onload = () => {
        actionObjectImg.style.opacity = 1;
    };

    function checkInputsFilled() {
        if (
            placeInput.value.trim().length > 0 &&
            actionInput.value.trim().length > 0 &&
            objectInput.value.trim().length > 0
        ) {
            submitButton.style.display = "block";
        } else {
            submitButton.style.display = "none";
        }
    }
    
    // 确保事件正确绑定到每个输入框
    placeInput.addEventListener('input', checkInputsFilled);
    actionInput.addEventListener('input', checkInputsFilled);
    objectInput.addEventListener('input', checkInputsFilled);
    
    // 初始化时隐藏按钮
    submitButton.style.display = "none";
}



function showEnding() {
    const userAnswer = {
        place: placeInput.value.toLowerCase().trim(),
        action: actionInput.value.toLowerCase().trim(),
        object: objectInput.value.toLowerCase().trim()
    };

    let matchedStandard = standardAnswers.some(answer =>
        answer.place === userAnswer.place &&
        answer.action === userAnswer.action &&
        answer.object === userAnswer.object
    );

    const endingScreen = document.getElementById('endingScreen');
    const endingImg = document.getElementById('endingImg');
    const endingText = document.getElementById('endingText');

    if (matchedStandard) {
        endingImg.src = 'mad/endA.jpg';
        endingText.textContent = "The police didn’t find you suspicious, and they found out you were a communication design student. So they figured you weren’t much of a threat — I mean, all you really did was code and print books. You went home and nothing bad happened to you.";
    } else {
        endingImg.src = 'mad/endB.jpg';
        endingText.textContent = "Your answer was so outrageous that the police kept you under investigation for a whole week before finally realizing you were innocent. Congrats! You just earned yourself a week’s worth of absences.";
    }

    // 显示结局遮罩层（淡入）
    endingScreen.style.display = 'flex';
    setTimeout(() => {
        endingScreen.style.opacity = 1;
    }, 50); // 轻微延迟确保淡入效果

    // 图片加载后淡入
    endingImg.onload = () => {
        endingImg.style.opacity = 1;
    };

    // 逐字打字机效果出现
    endingText.style.opacity = 1;
    typeWriterEffect(endingText);
}

// 打字机效果
function typeWriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;

    const typing = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(typing);
    }, 30);
}

// 标准答案定义（缺失了这部分！）
const standardAnswers = [
    {place: "dining hall", action: "drinking", object: "latte"},
    {place: "printing center", action: "cutting", object: "poster"},
    {place: "library", action: "coding", object: "website"}
];

// 提交按钮绑定事件（缺失了这部分！）
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', showEnding);

// 确保输入框检查函数在外层定义，不要嵌套在其他函数中
function checkInputsFilled() {
    if (
        placeInput.value.trim().length > 0 &&
        actionInput.value.trim().length > 0 &&
        objectInput.value.trim().length > 0
    ) {
        submitButton.style.display = "block";
    } else {
        submitButton.style.display = "none";
    }
}

// 事件绑定确保在外层
placeInput.addEventListener('input', checkInputsFilled);
actionInput.addEventListener('input', checkInputsFilled);
objectInput.addEventListener('input', checkInputsFilled);

// 页面加载时初始化按钮状态
submitButton.style.display = "none";
