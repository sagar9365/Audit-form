const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXdr_uY6UlYBANWuJ0aFXEyTm0/exec";

const dhNames = ["BLR-BTM-2","BLR-BTM LAYOUT NEW","BLR-RICHMOND TOWN","BLR-JP Nagar","BLR-BANASHANKARI","BLR-Mathikere","BLR-Kalyan Nagar Network","BLR-Chickpet New","BLR-SHIVAJI NAGAR","BLR-Cholayakanakalli","BLR-Jakkur New","BLR-Jakkur Network","BLR-HEBBAL NEW","BLR-Nikoo Home New","BLR-TC Palaya","BLR-Devanahalli","BLR-Yelahanka Network","BLR-Nehru Nagar","BLR-GUNJUR","BLR-HSR-3","BLR-Narayana reddy Layout","BLR-Kannika Nagar","BLR-GUNJUR Network","BLR-Mico layout network-2","BLR-Bannerghatta Network 2","BLR-BANNERGHATTA","BLR-Kambhipura","BLR-JP NAGAR New","BLR-KALYAN NAGAR NEW","BLR-Challakere","BLR-Koramangala Network","BLR-Hennur New","BLR-Dasarahalli","BLR-SHIVAJI NAGAR Network","BLR-Margosa road","BLR-Banjara Layout"];

const dhInput = document.getElementById("dhName");
const suggestions = document.getElementById("suggestions");
const qrReader = document.getElementById("qr-reader");
let cameraActive = false;

// DH Autocomplete
dhInput.addEventListener("input", ()=>{
  if(cameraActive) return;
  const val = dhInput.value.toLowerCase();
  suggestions.innerHTML="";
  if(val){
    dhNames.filter(n=>n.toLowerCase().includes(val)).forEach(n=>{
      const div=document.createElement("div");
      div.textContent=n;
      div.onclick=()=>{ dhInput.value=n; suggestions.innerHTML=""; };
      suggestions.appendChild(div);
    });
  }
});
document.addEventListener("click", e=>{
  if(e.target!==dhInput && !dhInput.contains(e.target)) suggestions.innerHTML="";
});

// QR Scanner
function startScanner(){
  cameraActive = true;
  suggestions.innerHTML="";
  qrReader.style.display="block";
  const html5QrCode = new Html5Qrcode("qr-reader");
  const config={ fps:10, qrbox:250 };
  html5QrCode.start({facingMode:"environment"}, config, qrMessage=>{
    document.getElementById("lpnNumber").value=qrMessage;
    html5QrCode.stop().then(()=>{ qrReader.style.display="none"; cameraActive=false; });
  }, err=>{ console.log(err); });
}

// Click outside closes QR
document.addEventListener("click", e=>{
  if(cameraActive){
    if(!qrReader.contains(e.target) && !e.target.classList.contains('scan-btn')){
      qrReader.style.display="none";
      cameraActive=false;
    }
  }
});

// Remarks auto-fill
const remarksField = document.getElementById("remarks");
const differentQtyField = document.getElementById("differentQty");
const differentValueField = document.getElementById("differentValue");
const employeeNameField = document.getElementById("employeeName");
remarksField.addEventListener("change", ()=>{
  if(remarksField.value==="No issue"){
    differentQtyField.value=0;
    differentValueField.value=0;
    employeeNameField.value="";
  }else{
    differentQtyField.value="";
    differentValueField.value="";
  }
});

// Form Submit
document.getElementById("auditForm").addEventListener("submit", e=>{
  e.preventDefault();
  const formData={
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
  }).then(res=>res.text()).then(data=>{
    alert("Form submitted successfully!");
    document.getElementById("auditForm").reset();
  }).catch(err=>alert("Error: "+err));
});


