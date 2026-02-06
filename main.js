var browserMessage = document.getElementById("browser-message");
var statusCard = document.getElementById("browser-status");
var systemCard = document.getElementById("system-card");
var osVersionEl = document.getElementById("os-version");
var osArchEl = document.getElementById("os-arch");
var nextActions = document.getElementById("next-actions");

var FIREFOX_VERSION_REQUIRED = "37.0";

function getFirefoxVersion() {
	var match = navigator.userAgent.match(/Firefox\/([\d.]+)/);
	return match ? match[1] : null;
}

function setStatus(isOk, message) {
	statusCard.dataset.state = isOk ? "ok" : "warn";
	browserMessage.textContent = message;
}

function parseWindowsVersion(userAgent) {
	var match = userAgent.match(/Windows NT ([\d.]+)/);
	if (!match) {
		return "Bilinmiyor";
	}

	var versionMap = {
		"10.0": "Windows 10",
		"6.3": "Windows 8.1",
		"6.2": "Windows 8",
		"6.1": "Windows 7",
		"6.0": "Windows Vista",
		"5.1": "Windows XP"
	};

	return versionMap[match[1]] || "Windows NT " + match[1];
}

function getOsInfo() {
	var userAgent = navigator.userAgent;
	var platform = navigator.platform || "";
	var name = "Bilinmiyor";
	var version = "Bilinmiyor";
	var arch = "Bilinmiyor";

	if (/Windows NT/i.test(userAgent)) {
		name = "Windows";
		version = parseWindowsVersion(userAgent);
	} else if (/Mac OS X/i.test(userAgent)) {
		name = "macOS";
		var macMatch = userAgent.match(/Mac OS X ([\d_]+)/);
		version = macMatch ? macMatch[1].replace(/_/g, ".") : "Bilinmiyor";
	} else if (/Android/i.test(userAgent)) {
		name = "Android";
		var androidMatch = userAgent.match(/Android ([\d.]+)/);
		version = androidMatch ? androidMatch[1] : "Bilinmiyor";
	} else if (/Linux/i.test(platform)) {
		name = "Linux";
		version = "Dagitim surumu";
	}

	if (/Win64|x64|WOW64|amd64/i.test(userAgent) || /x86_64|Win64/i.test(platform)) {
		arch = "64-bit";
	} else if (/Win32|x86/i.test(platform)) {
		arch = "32-bit";
	}

	return { name: name, version: version, arch: arch };
}

function updateSystemInfo() {
	if (!systemCard) {
		return;
	}

	var osInfo = getOsInfo();
	osVersionEl.textContent = osInfo.version;
	osArchEl.textContent = osInfo.arch;
	systemCard.classList.remove("is-hidden");
}

function updateStatus() {
	var version = getFirefoxVersion();

	if (!version) {
		setStatus(
			false,
			"Bu tarayici Firefox degil. E-imza icin Firefox 37.0 kullanmaniz gerekiyor."
		);
		if (nextActions) {
			nextActions.classList.add("is-hidden");
		}
		return;
	}

	if (version === FIREFOX_VERSION_REQUIRED) {
		setStatus(true, "Harika! Firefox 37.0 kullaniyorsunuz. Devam edebilirsiniz.");
		updateSystemInfo();
		document.body.classList.add("system-only");
		if (nextActions) {
			nextActions.classList.remove("is-hidden");
		}
		return;
	}

	setStatus(
		false,
		"Firefox " + version + " tespit edildi. Lutfen Firefox 37.0 kurun ve diger surumleri kaldirin."
	);
	if (systemCard) {
		systemCard.classList.add("is-hidden");
	}
	document.body.classList.remove("system-only");
	if (nextActions) {
		nextActions.classList.add("is-hidden");
	}
}

updateStatus();

var nextStepBtn = document.getElementById("next-step");
if (nextStepBtn) {
	nextStepBtn.onclick = function () {
		window.location.href = "step2.html";
	};
}
