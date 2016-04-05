window.onload = function () {
    window.city = document.getElementById("aqi-city-input");
    window.air = document.getElementById("aqi-value-input");
    window.btn = document.getElementById("add-btn");
    window.table = document.getElementById("aqi-table");
    window.aqiData = {};
    /**
     * aqiData，存储用户输入的空气指数数据
`	 * 示例格式：
`	 * aqiData = {
`	 *    "北京": 90,
`	 *    "上海": 40
`	 * };
`	 */
    window.canAdd = false;
    init();
}

/**
 * 表单验证
 */
function checkData(city, value) {
    var cityReg = /^[a-zA-z\u4e00-\u9fa5]+$/i,
    airReg = /^-?[1-9][0-9]*$/;
    if (city == "") {
        alert("城市名不能为空值!");
        return;
    }
    if (value == "") {
        alert("空气质量指数不能为空值!");
        return;
    }
    if (!cityReg.test(city)) {
        alert("城市名必须为中英文字符!");
        return;
    }
    if (!airReg.test(value)) {
        alert("空气质量指数必须为整数!");
        return;
    }
    if (aqiData.hasOwnProperty(city)) {
        if (!confirm("该城市已存在，是否覆盖？")) {
            return;
        }
    }
    canAdd = true;
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var nullReg = /(^\s*)|(\s*$)/g;
    var aqi_city = city.value.replace(nullReg, ""),
    aqi_value = air.value.replace(nullReg, "");
    checkData(aqi_city, aqi_value);
    if (canAdd) {
        aqiData[aqi_city] = Number.parseInt(aqi_value);
        canAdd = false;
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    if (Object.getOwnPropertyNames(aqiData).length > 0) {
        var html = "<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
        for (var city in aqiData) {
            html += "<tr><td>" + city + "</td><td>" + aqiData[city] + "</td><td><button>删除</button></td>";
        } table.innerHTML = html;
    } else {
        table.innerHTML = "";
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    delete aqiData[this.parentNode.parentNode.firstChild.innerText];
    renderAqiList();
}

/**
 * 添加事件
 */
function addEvent(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event, handler);
    } else {
        element["on" + event] = handler;
    }
}

/**
 * 删除的事件代理
 */
function delegateEvent(element, tag, event, handler) {
    addEvent(element, event, function () {
        var event = arguments[0] || window.event;
        var target = event.target || event.srcElement;
        if (target && target.nodeName.toUpperCase() === tag.toUpperCase()) {
            handler.call(target, event);
        }
    });

}

/**
 * 初始化
 */
function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    addEvent(btn, "click", addBtnHandle);
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    delegateEvent(table, "button", "click", delBtnHandle);
}
