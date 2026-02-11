let isEditorMode = false;
let currentMatches = [];
let currentMatchIndex = -1;
let isJsonEditorExpanded = false;

function adjustFontSize(elementId) {
  const element = document.getElementById(elementId);
  const contentLength = element.value.length;
  let fontSize = 14;
  if (contentLength > 5000) { fontSize = 10; } 
  else if (contentLength > 2500) { fontSize = 11; } 
  else if (contentLength > 1000) { fontSize = 12; } 
  else if (contentLength > 500) { fontSize = 13; }
  element.style.fontSize = `${fontSize}px`;
}

function updateLineNumbers() {
  const textareaContent = document.getElementById('jsonEditor').value;
  const lineNumbers = document.getElementById('lineNumbers');
  const lines = textareaContent.split('\n');
  const count = lines.length;
  
  lineNumbers.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const lineNumberDiv = document.createElement('div');
    lineNumberDiv.textContent = i;
    lineNumbers.appendChild(lineNumberDiv);
  }
  
  let calculatedHeight;
  if (isJsonEditorExpanded) {
      const minLines = 15;
      const lineHeight = 18;
      calculatedHeight = Math.max(minLines * lineHeight, count * lineHeight);
  } else {
      calculatedHeight = 245;
  }
  
  document.getElementById('jsonDisplay').style.height = `${calculatedHeight}px`;
  document.getElementById('jsonEditor').style.height = `${calculatedHeight}px`;
  
  document.getElementById('jsonDisplay').onscroll = function() {
    lineNumbers.scrollTop = document.getElementById('jsonDisplay').scrollTop;
  };
  
  document.getElementById('jsonEditor').onscroll = function() {
    lineNumbers.scrollTop = document.getElementById('jsonEditor').scrollTop;
  };
}

function toggleEditorMode() {
  isEditorMode = !isEditorMode;
  const jsonDisplay = document.getElementById('jsonDisplay');
  const jsonEditor = document.getElementById('jsonEditor');
  if (isEditorMode) {
    jsonDisplay.classList.add('editing');
    jsonEditor.classList.add('editing');
    jsonEditor.focus();
  } else {
    try {
      const json = JSON.parse(jsonEditor.value);
      const formattedJson = JSON.stringify(json, null, 2);
      jsonEditor.value = formattedJson;
      syntaxHighlightJson();
    } catch (e) {
      console.error("Error formatting JSON:", e);
      return;
    }
    jsonDisplay.classList.remove('editing');
    jsonEditor.classList.remove('editing');
  }
}

function searchInJson() {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (!searchTerm) return;
  currentMatches = [];
  currentMatchIndex = -1;
  const text = document.getElementById('jsonEditor').value;
  try {
    const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      currentMatches.push({ start: match.index, end: match.index + searchTerm.length });
    }
    if (currentMatches.length > 0) {
      findNextMatch();
    } else {
      alert('Совпадений не найдено!');
    }
  } catch (e) {
    console.error("Error in searchInJson:", e);
    alert('Ошибка при поиске: ' + e.message);
  }
}

function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function escapeHtml(unsafe) { return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }

function findNextMatch() {
  if (currentMatches.length === 0) return;
  currentMatchIndex = (currentMatchIndex + 1) % currentMatches.length;
  highlightCurrentMatch();
}

function findPrevMatch() {
  if (currentMatches.length === 0) return;
  currentMatchIndex = (currentMatchIndex - 1 + currentMatches.length) % currentMatches.length;
  highlightCurrentMatch();
}

function highlightCurrentMatch() {
  if (currentMatchIndex < 0 || currentMatches.length === 0) return;
  const match = currentMatches[currentMatchIndex];
  if (isEditorMode) {
    const textarea = document.getElementById('jsonEditor');
    textarea.focus();
    textarea.setSelectionRange(match.start, match.end);
    const text = textarea.value;
    const beforeMatch = text.substring(0, match.start);
    const linesBefore = beforeMatch.split('\n').length - 1;
    const lineHeight = 20; 
    const scrollPosition = linesBefore * lineHeight;
    textarea.scrollTop = scrollPosition - textarea.clientHeight / 2;
  } else {
    syntaxHighlightJson(match);
    const jsonDisplay = document.getElementById('jsonDisplay');
    const highlightEl = jsonDisplay.querySelector('.highlight-match');
    if (highlightEl) {
      const offsetTop = highlightEl.offsetTop;
      jsonDisplay.scrollTop = offsetTop - jsonDisplay.clientHeight / 2;
    }
  }
}

function syntaxHighlightJson(currentMatch = null) {
  const jsonText = document.getElementById('jsonEditor').value;
  const displayEl = document.getElementById('jsonDisplay');
  if (!jsonText.trim()) {
    displayEl.innerHTML = '';
    return;
  }
  const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[[\]{}]|,|:)/g;
  let result = '';
  let lastIndex = 0;
  let match;
  while ((match = jsonRegex.exec(jsonText)) !== null) {
    const token = match[0];
    const position = match.index;
    if (position > lastIndex) {
      result += jsonText.substring(lastIndex, position);
    }
    let spanClass = '';
    let isSearchMatch = false;
    if (currentMatch && currentMatch.start !== undefined && currentMatch.end !== undefined) {
      if ((position <= currentMatch.start && position + token.length > currentMatch.start) || (position >= currentMatch.start && position < currentMatch.end)) {
        isSearchMatch = true;
      }
    }
    if (/^"/.test(token)) { spanClass = /:$/.test(token) ? 'json-key' : 'json-string'; } 
    else if (/true|false/.test(token)) { spanClass = 'json-boolean'; } 
    else if (/null/.test(token)) { spanClass = 'json-null'; } 
    else if (/^-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?$/.test(token)) { spanClass = 'json-number'; } 
    else if (/[[{}]/.test(token)) { spanClass = 'json-bracket'; } 
    else if (token === ':') { spanClass = 'json-colon'; } 
    else if (token === ',') { spanClass = 'json-comma'; }
    let spanClass2 = isSearchMatch ? `${spanClass} highlight-match` : spanClass;
    result += `<span class="${spanClass2}">${escapeHtml(token)}</span>`;
    lastIndex = position + token.length;
  }
  if (lastIndex < jsonText.length) {
    result += jsonText.substring(lastIndex);
  }
  displayEl.innerHTML = result;
}

function updateEncodedOutput(json) {
  try {
    const jsonString = JSON.stringify(json);
    const compressed = pako.deflate(jsonString);
    const base64 = btoa(String.fromCharCode.apply(null, compressed));
    const encodedOutput = document.getElementById('encodedOutput');
    encodedOutput.value = '0' + base64;
    adjustFontSize('encodedOutput');
  } catch (e) {
    document.getElementById('encodedOutput').value = 'Encoding error: ' + e.message;
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

function calculateMultiPointGradient(colors, steps) {
  const gradient = [];
  const colorPoints = colors.map(hexToRgb);
  if (colorPoints.some(c => c === null) || colorPoints.length < 2) return [];

  const segments = colorPoints.length - 1;
  const stepsPerSegment = (steps - 1) / segments;

  for (let i = 0; i < steps; i++) {
      const globalRatio = i / (steps - 1);
      const segmentIndex = Math.min(Math.floor(globalRatio * segments), segments - 1);
      
      const startColor = colorPoints[segmentIndex];
      const endColor = colorPoints[segmentIndex + 1];

      const segmentStartRatio = segmentIndex / segments;
      const localRatio = (globalRatio - segmentStartRatio) * segments;

      const r = Math.round(startColor.r + (endColor.r - startColor.r) * localRatio);
      const g = Math.round(startColor.g + (endColor.g - startColor.g) * localRatio);
      const b = Math.round(startColor.b + (endColor.b - startColor.b) * localRatio);
      gradient.push(`${r},${g},${b}`);
  }
  return gradient;
}

function updateGradientPreview(colors) {
    const preview = document.getElementById('gradient-preview');
    preview.style.background = `linear-gradient(to right, ${colors.join(', ')})`;
}

function updateBlueprint() {
    try {
        const selectedBlueprintIndex = document.getElementById('blueprintSelector').value;
        const currentBlueprintData = blueprintTemplates[selectedBlueprintIndex].data;

        const itemName = document.getElementById('itemSelector').value;
        const selectedFont = document.getElementById('fontSelector').value;

        const colorPickers = document.querySelectorAll('#color-pickers-container input[type="color"]');
        const colors = Array.from(colorPickers).map(picker => picker.value);
        
        updateItemImage(itemName);
        updateGradientPreview(colors);

        const gradientColors = calculateMultiPointGradient(colors, 101);
        
        let newJson = JSON.parse(JSON.stringify(currentBlueprintData));
        
        let tempJsonString = JSON.stringify(newJson);
        const originalItemName = newJson.blueprint.entities[0].control_behavior.parameters[0].icon.name;
        const regex = new RegExp(originalItemName, "g");
        newJson = JSON.parse(tempJsonString.replace(regex, itemName));

        const parameters = newJson.blueprint.entities[0].control_behavior.parameters;
        parameters.forEach(param => {
            if (param.condition && typeof param.condition.constant !== 'undefined') {
                const percent = param.condition.constant;
                if (gradientColors[percent]) {
                    const newColor = gradientColors[percent];
                    param.text = param.text.replace(/(\[color=)[^\]]+(\])/, `$1${newColor}$2`);
                }
            }
            param.text = param.text.replace(/(\[font=)[^\]]+(\])/, `$1${selectedFont}$2`);
        });

        const formattedJson = JSON.stringify(newJson, null, 2);
        document.getElementById('jsonEditor').value = formattedJson;
        
        currentMatches = [];
        currentMatchIndex = -1;
        
        syntaxHighlightJson();
        updateLineNumbers();
        updateEncodedOutput(newJson);
        
        if (isEditorMode) {
          toggleEditorMode();
        }
    } catch(e) {
        console.error('Blueprint generation error:', e);
        alert('Случилась ошибка при генерации чертежа: ' + e.message);
    }
}

function updateItemImage(itemName) {
  const item = items.find(i => i.product === itemName);
  const imgElement = document.getElementById('selected-item-icon');
  if (item && item.icon) {
      imgElement.src = item.icon;
      imgElement.style.display = 'block';
  } else {
      imgElement.src = '';
      imgElement.style.display = 'none';
  }
}

function populateBlueprintSelector() {
  const selector = document.getElementById('blueprintSelector');
  blueprintTemplates.forEach((template, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = template.name;
      selector.appendChild(option);
  });
}

function populateItemSelector() {
    const selector = document.getElementById('itemSelector');
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.product;
        option.textContent = item.product.replace(/-/g, ' ');
        selector.appendChild(option);
    });
}

function populateFontSelector() {
    const selector = document.getElementById('fontSelector');
    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.name;
        option.textContent = font.name;
        selector.appendChild(option);
    });
    selector.value = 'default-bold';
}

function updateColorPickersUI() {
    const container = document.getElementById('color-pickers-container');
    const points = parseInt(document.getElementById('gradientPoints').value, 10);
    
    const currentColors = Array.from(container.querySelectorAll('input[type="color"]')).map(el => el.value);
    
    container.innerHTML = '';

    const defaultColors = ['#77b8ed', '#36af29', '#ffcc00', '#e35959', '#ffffff', '#8a2be2', '#00ced1', '#ff4500', '#2e8b57', '#d2691e'];

    for (let i = 0; i < points; i++) {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = `color-${i}`;
        colorPicker.value = currentColors[i] || defaultColors[i] || '#000000';
        colorPicker.addEventListener('input', updateBlueprint);
        container.appendChild(colorPicker);
    }
    updateBlueprint();
}

function toggleJsonEditorSize() {
    isJsonEditorExpanded = !isJsonEditorExpanded;
    const button = document.getElementById('toggle-json-editor-size');
    button.textContent = isJsonEditorExpanded ? 'Свернуть' : 'Развернуть';
    updateLineNumbers();
}

function encodeJson() {
  try {
    const jsonText = document.getElementById('jsonEditor').value;
    const json = JSON.parse(jsonText);
    updateEncodedOutput(json);
    if (isEditorMode) {
      const formattedJson = JSON.stringify(json, null, 2);
      document.getElementById('jsonEditor').value = formattedJson;
    }
  } catch (e) {
    alert('Error encoding: ' + e.message);
  }
}

function copyEncodedBlueprint() {
  const encodedField = document.getElementById('encodedOutput');
  encodedField.select();
  document.execCommand('copy');
  const button = document.querySelector('button[onclick="copyEncodedBlueprint()"]');
  const originalText = button.textContent;
  button.textContent = 'Скопировано!';
  setTimeout(() => {
    button.textContent = originalText;
  }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    populateBlueprintSelector();
    populateItemSelector();
    populateFontSelector();
    
    document.getElementById('blueprintSelector').addEventListener('change', updateBlueprint);
    document.getElementById('itemSelector').addEventListener('change', updateBlueprint);
    document.getElementById('gradientPoints').addEventListener('change', updateColorPickersUI);
    document.getElementById('fontSelector').addEventListener('change', updateBlueprint);
    document.getElementById('jsonEditor').addEventListener('input', updateLineNumbers);
    
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') searchInJson();
    });
    
    document.getElementById('jsonDisplay').addEventListener('click', function() {
      if (!isEditorMode) toggleEditorMode();
    });
    
    document.getElementById('jsonEditor').addEventListener('blur', function() {
      if (isEditorMode) toggleEditorMode();
    });
    
    updateColorPickersUI();
});
