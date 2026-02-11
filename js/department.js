const params = new URLSearchParams(window.location.search);
const dept = params.get('dept');

document.getElementById('deptTitle').innerText = dept;

function goHome() {
    window.location.href = "index.html";
}

async function loadDepartmentSummary() {

    const { data: contracts } = await supabaseClient
        .from('contracts')
        .select('*')
        .eq('department', dept);

    const contractIds = contracts.map(c => c.id);

    const totalContracts = contracts.length;
    const totalAmount = contracts.reduce((s,c)=>s+parseFloat(c.contract_amount),0);

    let totalPaid = 0;
    let totalCost = 0;
    let material = 0, office = 0, reimbursement = 0;

    if (contractIds.length > 0) {

        const { data: payments } = await supabaseClient
            .from('payments')
            .select('*')
            .in('contract_id', contractIds);

        totalPaid = payments.reduce((s,p)=>s+parseFloat(p.payment_amount),0);

        const { data: purchases } = await supabaseClient
            .from('purchases')
            .select('*')
            .in('contract_id', contractIds);

        purchases.forEach(p=>{
            totalCost += parseFloat(p.amount);
            if(p.category==='material') material+=parseFloat(p.amount);
            if(p.category==='office') office+=parseFloat(p.amount);
            if(p.category==='reimbursement') reimbursement+=parseFloat(p.amount);
        });

        createCostChart(material, office, reimbursement);
    }

    document.getElementById('totalContracts').innerText = totalContracts;
    document.getElementById('totalAmount').innerText = totalAmount;
    document.getElementById('totalPaid').innerText = totalPaid;
    document.getElementById('totalCost').innerText = totalCost;
}

function createCostChart(material, office, reimbursement){
    new Chart(document.getElementById('costChart'),{
        type:'pie',
        data:{
            labels:['材料','办公','报销'],
            datasets:[{
                data:[material,office,reimbursement],
                backgroundColor:['#b6a9c8','#a09bc3','#9dbfc3']
            }]
        }
    });
}

function showCreate(){
    document.getElementById('modal').style.display='flex';
    document.getElementById('modalContent').innerHTML=`
        <h3>创建合同</h3>
        <input id="cCode" placeholder="项目号"><br><br>
        <input id="cName" placeholder="项目名称"><br><br>
        <input id="cAmount" type="number" placeholder="合同金额"><br><br>
        <button onclick="createContract()">提交</button>
        <button onclick="closeModal()">取消</button>
    `;
}

async function createContract(){
    const code=document.getElementById('cCode').value;
    const name=document.getElementById('cName').value;
    const amount=document.getElementById('cAmount').value;

    await supabaseClient.from('contracts').insert([{
        department:dept,
        project_code:code,
        project_name:name,
        contract_amount:amount
    }]);

    closeModal();
    loadDepartmentSummary();
}

function showRecord(){
    alert("下一步我们做录入数据弹窗");
}

function closeModal(){
    document.getElementById('modal').style.display='none';
}

loadDepartmentSummary();
