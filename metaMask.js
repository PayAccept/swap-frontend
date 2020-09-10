window.addEventListener('load', async () => {
    // New web3 provider
          if (window.ethereum) {
              window.web3 = new Web3(window.ethereum);
              try {
                  // ask user for permission
                  await window.ethereum.enable();
                  callCheck();
                  // user approved permission
              } catch (error) {
                  // user rejected permission
                  alert('user rejected permission');
              }
          }
    // Old web3 provider
      else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
          // no need to ask for permission
      }
    // No web3 provider
      else {
          alert('Metamask is not detected');
    }
  });
  //console.log (window.web3.currentProvider)


const oldTokenAddress = "0x1fe72034da777ef22533eaa6dd7cbe1d80be50fa";
const newTokenAddress = "0xCA221f84433Caa091349e4e11f18437c1734e0f7";
const netWorkId = "https://ropsten.etherscan.io/tx/"

async function callCheck(){
    let address = await window.web3.eth.getAccounts();
    window.oldToken =await new window.web3.eth.Contract(
        payAcceptAbi,
        oldTokenAddress
    );

    window.newToken =await new window.web3.eth.Contract(
        payAcceptAbi,
        newTokenAddress
    );

    let a = await window.oldToken.methods.balanceOf(address[0]).call();

    if(Number(a) === 0){
        $("#loaderDiv").html('<p class="text"> You dont have old Token </p>');
    }else{

        let b = await window.oldToken.methods.allowance(address[0],newTokenAddress).call();
        if(Number(b) >= Number(a)){
            $("#loaderDiv").html('<p class="text"> Swap with new Token </p> <button onclick="swap()" class="btn btn-blue"> Swap Token</button>');
        }else{
            $("#loaderDiv").html('<p class="text">Approving OldToken For Swap</p> <button onclick="approve()" class="btn btn-blue"> Approve Token</button>');
        }
    }

}

async function approve(){
    let address = await window.web3.eth.getAccounts();
    let a = await window.oldToken.methods.balanceOf(address[0]).call();

    window.oldToken.methods
      .approve(newTokenAddress,a)
      .send({
        from: address[0],
        value: 0,
    }).on('transactionHash', (hash) => {
        var url = netWorkId+hash;
        $("#loaderDiv").html('<p class="text"> <i class="fas fa-spinner fa-spin fa-3x"></i></br></br>Approving Old Token To Swap .. <br/> <a href='+url+' target="_blank" >check transaction status</a></span>');
    }).on('receipt', (receipt) => {
        $("#loaderDiv").html('<p class="text"> Swap with new Token </p> <button onclick="swap()" class="btn btn-blue"> Swap Token </button>');
    }).on("error", (error) => {
        alert("Error In approving");
    })

}

async function swap(){
    let address = await window.web3.eth.getAccounts();
    let a = await window.oldToken.methods.balanceOf(address[0]).call();

    window.newToken.methods
      .swapWithOldToken(a)
      .send({
        from: address[0],
        value: 0,
    }).on('transactionHash', (hash) => {
        var url = netWorkId+hash;
        $("#loaderDiv").html('<p class="text"> <i class="fas fa-spinner fa-spin fa-3x"></i></br></br>Swapping Old Token .. <br/> <a href='+url+' target="_blank" >check transaction status</a></p>');
    }).on('receipt', (receipt) => {
        $("#loaderDiv").html('<p class="text"> <i class="fas fa-thumbs-up fa-3x"></i></br></br>Swap Is Done</p>');
    }).on("error", (error) => {
        alert("Error In Swap");
    })

}

