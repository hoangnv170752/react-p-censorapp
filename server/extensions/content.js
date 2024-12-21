// Log để kiểm tra xem content script có chạy đúng không
console.log('Content script has been loaded!');

// Thêm một nút vào giao diện trang web
const button = document.createElement('button');
button.textContent = 'Click me!';
button.style.position = 'fixed';
button.style.bottom = '10px';
button.style.right = '10px';
button.style.padding = '10px';
button.style.backgroundColor = '#007ACC';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
document.body.appendChild(button);

// Lắng nghe sự kiện click trên nút
button.addEventListener('click', () => {
  alert('Button clicked!');
});