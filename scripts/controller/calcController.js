class CalcController{

    constructor(){  
        this._audio = new Audio('click.mp3')
        this._audioOnOff = false
        this._lastOperator = ''
        this._lastNumber = ''

         
        this._operation = []           //Da inicialiazição a classe quando chamada 
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('#display') // Captura o display do DOM
        this._dateEl = document.querySelector('#data') // Captura data do DOM
        this._timeEl = document.querySelector('#hora') // Captura a hora do DOM
        this._currentDate;         //informação da data atual 
        this.initialize()          //metodo principal, tudo que vai acontecer está dentro desse metodo
        this.initButtonsEvent()
        this.initKeyboard()
    }
    pastFromClipboard(){
        document.addEventListener('paste', e=>{
        let text = e.clipboardData.getData('Text')
        this.displayCalc = parseFloat(text)
        })
    }

    copyToClipboard(){
        let input = document.createElement('input')

        input.value = this.displayCalc
        document.body.appendChild(input)

        input.select();

        document.execCommand("Copy")
        input.remove()

    }
    initialize(){  
        this.setDisplayDateTime()
       
        setInterval(() => {                    //Adiciona um intervalo para ir atualizando a hora e a data

        this.setDisplayDateTime()

        }, 1000);

        this.setLastNumberToDisplay()
        this.pastFromClipboard()

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio()
            })
        })

    }
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff

    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play();

        }
    }
    initKeyboard(){
        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch(e.key){
                case 'Escape':
                this.clearAll()
                break
            
            case 'Backspace':
                this.clearEntry()
                break
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
            this.addOperation('e.key')
    
                break
            case 'Enter':
            case '=':
                this.calc()
                
    
                break
            case '.':
            case ',':
                this.addDot('.')
    
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(e.key))
                break
            case 'c':
                if(e.ctrlKey){
                    this.copyToClipboard()
                }
            }})
        
    }
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event,fn, false)
        })
    

    }
    clearAll(){
    this._operation = [];
    this._lastNumber = ''
    this._lastOperator = ''
    this.setLastNumberToDisplay()

    
    }
    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()

    }
    getLastOperation(){
        return this._operation[this._operation.length-1]
    }
    setLastOperation(value){
        this._operation[this._operation.length-1] = value

    }
    pushOperation(value){
        this._operation.push(value)
        if(this._operation.length > 3){
            

            this.calc()
            

        }}
    getResult() {
        return eval(this._operation.join(''))
    }
    
    calc(){
        let last=''
        this._lastOperator = this.getLastItem()
        if(this._operation.length < 3){
            let firstitem = this._operation[0]
            
            this._operation = [firstitem, this._lastOperator, this._lastNumber]
                   
    }
        if(this._operation.length>3){
            last = this._operation.pop()
            this._lastNumber = this.getResult()
        }
        else if(this._operation.length==3){
            this._lastNumber = this.getLastItem(false)
            

        }
 
        
        let result = this.getResult()
        if(last == '%'){
        result/=100
        this._operation = [result]
        this.setLastNumberToDisplay()


        }
        else{
            
            this._operation = [result]
            if(last) this._operation.push(last)
           
        }
        this.setLastNumberToDisplay()
    

    }
    getLastItem(isOperator = true){
        let lastitem;
        for(let i = this._operation.length-1; i>=0; i-- ){
            
            if(this.isOperator(this._operation[i]) == isOperator){
                lastitem = this._operation[i]
                break
            }
        }
        if(!lastitem){
            lastitem = (isOperator) ? this._lastOperator : this._lastNumber
        }
            return lastitem
    }
    setLastNumberToDisplay(){
        let lastnumber = this.getLastItem(false)

        

        if(!lastnumber) lastnumber=0
        this.displayCalc = lastnumber
    }
    isOperator(value){
        return (['+','-','%','/','*'].indexOf(value) > -1)
            
    }
    
    addOperation(value){
        if (isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                //trocar operador
                this.setLastOperation(value);

            }
            
            else{
                this.pushOperation(value)
                this.setLastNumberToDisplay()
                
            }
        }
        

        else if(this.isOperator(value)) {
            this.pushOperation(value)}

        else {   
            let newValue = this.getLastOperation().toString() + value.toString()
            this.setLastOperation((newValue))
            this.setLastNumberToDisplay()

        }
    } 
    addDot(){
    let lastoperation = this.getLastOperation();
    if (typeof lastoperation === 'string' && lastoperation.split('').indexOf('.') > -1){
        return
    }
    if(this.isOperator(lastoperation) || !lastoperation){
        this.pushOperation('0.')
    }
    else {
        this.setLastOperation(lastoperation.toString() + '.');
    }
    this.setLastNumberToDisplay()
    }
    
    setError(){
        this.displayCalc = 'MAX 10 NUM';
    }

    execBtn(value){
        this.playAudio();
        switch(value){
            case 'ac':
            this.clearAll()
            break
        
        case 'ce':
            this.clearEntry()
            break
        case 'soma':
            this.addOperation('+')

            break
        case 'subtracao':
            this.addOperation('-')

            break
        case 'divisao':
            this.addOperation('/')

            break
        case 'multiplicacao':
            this.addOperation('*')

            break
        case 'porcento':
            this.addOperation('%')

            break
        case 'igual':
            this.calc()
            

            break
        case 'ponto':
            this.addDot('.')

            break
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            this.addOperation(parseInt(value))
            break
        default:
            this.setError()
            break

        }
    }


    initButtonsEvent(){

        let buttons = document.querySelectorAll('#buttons > g , #parts > g' ) //Seleciona as tags filhas do id button e parts
        buttons.forEach((btn,index)=>{                  //Atribui função clique a todos os botões
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace('btn-','')
                this.execBtn(textBtn)
                        
    })
    this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e =>{
        btn.style.cursor = 'pointer'

    })
})}


    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale) 
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)

    }
    get displayTime(){         // Recebe o Time do display
        return this._timeEl.innerHTML;

    }
    set displayTime(value){      // Muda o time do display
        this._timeEl.innerHTML = value
    }
    get displayDate (){          //Recebe a data do display
        return this._dateEl.innerHTML;
    }
    set displayDate (value){       //Muda a data do display
        this._dateEl.innerHTML = value
    }

    get displayCalc (){          // Recupera o valor fora da classe quando chamado 
        return this._displayCalcEl.innerHTML
    }   

    set displayCalc (value){      // Muda o valor quando chamado 
        if (value.toString().length > 10){
            this.setError();
            return
        }
        this._displayCalcEl.innerHTML = value
    }

    get currentDate (){                        //
        return new Date()
    }

    set currentDate(value){
        this._currentDate = value
    }

} 