// ======== CONFIG ========
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6aUhQKkZbzWegwTyFRQEZ6FWyH9lPrLIf7IN4e2dK07Z42XZWP0e_D4AFhazdHkk/exec"; // Replace with your Apps Script Web App URL

// ======== DH Names ========
const dhNames = ["BLR-BTM-2","BLR-BTM LAYOUT NEW","BLR-RICHMOND TOWN","BLR-JP Nagar","BLR-BANASHANKARI","BLR-Mathikere","BLR-Kalyan Nagar Network","BLR-Chickpet New","BLR-SHIVAJI NAGAR","BLR-Cholayakanakalli","BLR-Jakkur New","BLR-Jakkur Network","BLR-HEBBAL NEW","BLR-Nikoo Home New","BLR-TC Palaya","BLR-Devanahalli","BLR-Yelahanka Network","BLR-Nehru Nagar","BLR-GUNJUR","BLR-HSR-3","BLR-Narayana reddy Layout","BLR-Kannika Nagar","BLR-GUNJUR Network","BLR-Mico layout network-2","BLR-Bannerghatta Network 2","BLR-BANNERGHATTA","BLR-Kambhipura","BLR-JP NAGAR New","BLR-KALYAN NAGAR NEW","BLR-Challakere","BLR-Koramangala Network","BLR-Hennur New","BLR-Dasarahalli","BLR-SHIVAJI NAGAR Network","BLR-Margosa road","BLR-Banjara Layout","BLR-Ramamurthy Nagar Network","BLR-BASAVANAPURA NETWORK 2","BLR-Bagalur","BLR-RWF Yelahanka","Sanjaynagar","BLR-BHADRAPPA LAYOUT NETWORK","BLR-Bhadrapppa Layout","BLR-HBR Layout","BLR-Dooravani Nagar","BLR-Nagavara","BLR-Narayanapura","BLR-YELAHANKA","BLR-Kasturinagar","BLR-Vidyaranyapura","BLR-Kogilu Road","BLR-Narayanapura Network","BLR-INDIRANAGAR NEW","BLR-Malleshwaram new","BLR-RAMAMURTHY NAGAR NEW"];

const dhInput = document.getElementById("dhName");
const suggestions = document.getElementById("suggestions");

// ======== DH Autocomplete ========
dhInput.addEventListener("input", () => {
  const val = dhInput.value.toLowerCase();
  suggestions.innerHTML = "";
  if (val) {
    dhNames.filter(n => n.toLowerCase().includes(val)).forEach(n => {
      const div = document.createElement("div");
      div.textContent = n;
      div.onclick = () => { dhInput.value = n; suggestions.innerHTML = ""; };
      suggestions.appendChild(div);
    });
  }
});
document.addEventListener("click", e => { if(e.target!==dhInput) suggestions.innerHTML=""; });

// ======== QR + Barcode Scanner ========
function startScanner(){
  const readerDiv = document.getElementById("qr-reader");
  readerDiv.style.display = "block";
  const html5QrCode = new Html5Qrcode("qr-reader");
  const config = { fps: 10, qrbox: 250,
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.DATA_MATRIX,
      Html5QrcodeSupportedFormats.PDF_417,
      Html5QrcodeSupportedFormats.AZTEC
    ]
  };
  html5QrCode.start({ facingMode: "environment" }, config, qrMessage => {
    document.getElementById("lpnNumber").value = qrMessage;
    html5QrCode.stop().then(()=>{ readerDiv.style.display="none"; });
  }, err=>{ console.log(err); }).catch(err=>console.error(err));
}

// ======== Remarks Auto-fill ========
const remarksField = document.getElementById("remarks");
const differentQtyField = document.getElementById("differentQty");
const differentValueField = document.getElementById("differentValue");
const employeeNameField = document.getElementById("employeeName");

remarksField.addEventListener("change", ()=>{
  if(remarksField.value==="No issue"){
    differentQtyField.value = 0;
    differentValueField.value = 0;
    employeeNameField.value = "";
  }else{
    differentQtyField.value = "";
    differentValueField.value = "";
  }
});

// ======== Form Submission ========
document.getElementById("auditForm").addEventListener("submit", e=>{
  e.preventDefault();
  const formData = {
    dhName: dhInput.value,
    lpnNumber: document.getElementById("lpnNumber").value,
    lpnQty: document.getElementById("lpnQty").value,
    physicalQty: document.getElementById("physicalQty").value,
    type: document.getElementById("type").value,
    auditorName: document.getElementById("auditorName").value,
    remarks: document.getElementById("remarks").value,
    differentQty: document.getElementById("differentQty").value,
    differentValue: document.getElementById("differentValue").value,
    employeeName: document.getElementById("employeeName").value,
    timestamp: new Date().toISOString()
  };
  
  fetch(SCRIPT_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(formData)
  })
  .then(res=>res.text())
  .then(data=>{
    console.log("Response:", data);
    alert("Form submitted successfully!");
    document.getElementById("auditForm").reset();
  })
  .catch(err=>alert("Error: "+err));
});
