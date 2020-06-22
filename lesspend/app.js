var budgetController = (function() {
    
   var Expense = function(id,description,value) {
       
       this.id=id;
       this.description=description;
       this.value=value;
       this.percentage=-1
       
   };
    
   Expense.prototype.calcPercentage=function(totalIncome){
       
       if(totalIncome>0)
       {this.percentage=Math.round((this.value/totalIncome)*100);} else {
           this.percentage=-1;
       }
   };
    
   Expense.prototype.getPercentage=function(){
       return this.percentage;
   };
   
   
   
   var Income = function(id,description,value) {
       
       this.id=id;
       this.description=description;
       this.value=value;
       
   };
    

   var data = {
       
       allItems:{
           exp: [],
           inc: []
       },
       
       totals:{
           exp: 0,
           inc: 0
           
       },
       
       budget:0,
       
       percentage:-1
       
   };
    
    
   var calculateTotal= function(type){
       
       var sum=0;
       data.allItems[type].forEach(function(curr){
           sum+=curr.value;
       });
       
       data.totals[type]=sum;
       
   };
   
    
    
   
   
   return   {
       
       calculateBudget: function(){
           
           //Calculate total income and expenses
           
           calculateTotal('exp');
           calculateTotal('inc');
           
           //Calculate budget
           
           data.budget=data.totals.inc-data.totals.exp;
           
           //Calculate percentage
           
           data.percentage=data.totals.inc>0?Math.round((data.totals.exp/data.totals.inc)*100):-1;
           
           
       },
       
       calculatePercentages: function(){
           
           data.allItems.exp.forEach(function(curr){
               curr.calcPercentage(data.totals.inc);
           });
           
       },
       
       getPercentage: function(){
           
           var allPerc=data.allItems.exp.map(function(curr){
               return curr.getPercentage();
           });
           
           return allPerc;
       },
       
       
       addItem : function(type,des,val)
       {
           var newItem;
           
           
           //new ID
           if(data.allItems[type].length>0)
            ID= data.allItems[type][data.allItems[type].length-1].id+1;
           else
            ID=0;
           
           //Create new items
           
           if(type=='inc'){
               newItem= new Income(ID,des,val);
               
           } else if(type=='exp'){
               newItem= new Expense(ID,des,val);
               
           }
           
           
           //push new item
           
           data.allItems[type].push(newItem);
           
           
           //return new item
           return newItem;
       },
       
       
       deleteItem: function(type,id){
           
           var ids=data.allItems[type].map(function(curr){                
                     return curr.id;              });
           var index=ids.indexOf(id);
           
           if (index !==-1){
               data.allItems[type].splice(index,1);
           }
           
       },
       
       
       getBudget: function(){
           
           return {
               budget:data.budget,
               totalInc:data.totals.inc,
               totalExp:data.totals.exp,
               percentage:data.percentage
           }
           
       },
       
       testing: function(){
           console.log(data);
       }
       
   };
   
   
   
    
})();




var UIController = (function(){
    
    var DOMstrings={
        inputtype: '.add-type',
        inputdescription: '.add-des',
        inputvalue: '.add-value',
        inputbutton: '.btn-add',
        
        
        incomecontainer: '.income-list',
        expensecontainer: '.expense-list',
        
        
        budgetlabel:'.total-budget',
        incomelabel:'.top-inc-value',
        expenseslabel:'.top-exp-value',
        perlabel:'.top-exp-per',
        
        
        container : '.display',
        expperlabel: '.per',
        
        
        datelabel:'.month'
    };
    
    
    var  formatNumber= function(num,type){
            var numSplit;
            num=num.toFixed(2);
            
            numSplit=num.split('.');
            
            int = numSplit[0];
            
            
            if(int.length>6){
                
                int =int.substr(0,int.length-6)+','+int.substr(int.length-6,3)+','+int.substr(int.length-3,3);
                
            }
            
            
            else if(int.length>3){
                
                int =int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
                
            
            dec = numSplit[1];
            
             
            return (type==='exp' ? '-':'+')+' '+int+'.'+dec;
            
            
        };
    
        var nodeListForEach= function(list,callback){
                
              for(var i=0;i<list.length;i++){
                  callback(list[i],i);
              }  
                
            };
        
 
        
    
    return {
        displayMonth: function(){

            var now=new Date();
            var year,month,months;
            year=now.getFullYear();
            
            months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
           
             month=months[now.getMonth()];

            document.querySelector(DOMstrings.datelabel).textContent=month+' '+year;
            
           

        },
        
        
        changedType: function(){
            
            var fields=document.querySelectorAll(
                DOMstrings.inputtype+','+DOMstrings.inputdescription+','+DOMstrings.inputvalue
            
            );
            
            document.querySelector(DOMstrings.inputbutton).classList.toggle('red-btn');
            
            
            nodeListForEach(fields,function(curr){
                
                curr.classList.toggle('red');
                
            });
            
        },
        
        getinput: function(){
            
            return {
            
            type : document.querySelector(DOMstrings.inputtype).value,// + = inc, - = exp
            
            description: document.querySelector(   DOMstrings.inputdescription).value,
            
            value: parseFloat(document.querySelector(DOMstrings.inputvalue).value)
            }
        },
        
        getDOMStrings : function(){
            return DOMstrings;
        },
        
        
        displayPercentages : function(percentages){
          
            var fields=document.querySelectorAll(DOMstrings.expperlabel);
            
            
        
            
            nodeListForEach(fields,function(current,index){
                   
                
                if(percentages[index]>0)
                { current.textContent=percentages[index]+'%';}
                else{
                    current.textContent='---';
                }
                
                
                
                
                            });
            
            
        },
        
        
        addListItem : function(obj,type){
            
            var html, newhtml,element;
            
            //Create HTML string
            
            if (type==='inc')
            {
                 element= DOMstrings.incomecontainer;
                
                 html= ' <div class="item clearfix" id="inc-%id%"><div class="des ">%description%</div><div class="val-inc">%value%</div><button class="btn-del "><ion-icon name="ios-close-circle-outline"></ion-icon></button></div> ';
            }
            else if(type==='exp')
            {
                element= DOMstrings.expensecontainer;
                
                html='<div class="item clearfix" id="exp-%id%"><div class="des">%description%</div><div class="val-exp">%value%</div><div class="per">21%</div><button class="btn-del"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div>';
            }
        
            
            //Enter Actual data
            
            newhtml=html.replace('%id%',obj.id);            newhtml=newhtml.replace('%value%',formatNumber(obj.value,type)); newhtml=newhtml.replace('%description%',obj.description);
        
            
            //Insert html into dom
            
           document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
            
            
        },
        
        deleteListItem: function(selectorID){
            
           var ele= document.getElementById(selectorID)
           
           ele.parentNode.removeChild(ele);
            
        },
        
        clearFields : function(){
            
           var fields,fieldsarr;
            
           fields= document.querySelectorAll(DOMstrings.inputdescription+','+DOMstrings.inputvalue);
            
           fieldsarr=Array.prototype.slice.call(fields);
            
           fieldsarr.forEach(function(curr,i,array){
               
               curr.value='';
               
               
           });
            
           fieldsarr[0].focus();
            
        },
        
       
        
        displayBudget: function(obj){
            
           type= obj.budget>=0? 'inc':'exp';
            document.querySelector(DOMstrings.budgetlabel).textContent=formatNumber(Math.abs(obj.budget),type); 
            document.querySelector(DOMstrings.incomelabel).textContent=formatNumber(obj.totalInc,'inc'); 
            document.querySelector(DOMstrings.expenseslabel).textContent=formatNumber(obj.totalExp,'exp'); 
            
           if(obj.percentage>0){ 
               document.querySelector(DOMstrings.perlabel).textContent=obj.percentage+'%'; 
                               } else {
            document.querySelector(DOMstrings.perlabel).textContent='---'
                               }
            
            
        }
            
            
        };
})();







var controller= (function(budgetCtrl,UICtrl){
    
    var setupEventListeners = function(){
        
        var DOMstrings= UICtrl.getDOMStrings();
        
        // Eventlisteners-->  When add button is clicked or enter key is pressed
        document.querySelector(DOMstrings.inputbutton).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(e){

             if(e.keyCode === 13 || e.which ===13){
                 ctrlAddItem();
             }
         });
        
        
         document.querySelector(DOMstrings.container).addEventListener('click',ctrlDeleteitem);
        
        
        
         document.querySelector(DOMstrings.inputtype).addEventListener('change',UICtrl.changedType);
    
    };
    
    
    var updateBudget= function(){
   
        // 1. Calculate Budget
        
        budgetCtrl.calculateBudget();
        
        // 2. Return Budget
        
        var budget=budgetCtrl.getBudget();
        
        // 3. display budget on UI
        
        UICtrl.displayBudget(budget);
        
        
        //4. update percentages
             
        updatePercentages();

    };
    
    var updatePercentages= function(){
            
        // 1.calculate percentages
        
        budgetCtrl.calculatePercentages();
        
        // 2. read them from budget controller
        
        var percentages= budgetCtrl.getPercentage();
        
        
        // 3. display on UI
        
        UICtrl.displayPercentages(percentages);
        
    };
    
    
    var ctrlAddItem = function(){
      
        var input,newItem;
        
      // 1. Get data input
        
        input= UICtrl.getinput();
     //   console.log(input);
        
        
        if(input.description!=='' && !isNaN(input.value) && input.value>0)
      // 2. add item to budget controller'
         {   
               newItem= budgetCtrl.addItem(input.type,input.description,input.value);


              // 3. add item to UIcontroller and clear field

                UICtrl.addListItem(newItem,input.type);

              //4. Clear fields

                UICtrl.clearFields();

              //5. calc and Update budget

                updateBudget();
             
             
             //6. update percentages
             
                updatePercentages();

         }
 
    };
    
    var ctrlDeleteitem= function(event){
       
       var itemID,splitID,type,ID; 
        
        
        
        
        
        
        /////////////////////////////////////////////////////
        
      itemID=event.target.parentNode.parentNode.id;
       
        
        ////////////////////////////////////////////////////////
        
        
        
        if(itemID){
            //inc-1
            
            splitID =itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            
            
            //1. delete item from the data structure
            
            budgetCtrl.deleteItem(type,ID);
            
            
            //2. delete item from UI
            
            
            UICtrl.deleteListItem(itemID);
            
            //3. update and show budget
            
            updateBudget();
        }
        
    };
    
    return {
        init: function(){
            
            UICtrl.displayMonth();
            console.log('App has started');
            
            UICtrl.displayBudget({
                
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
                
                
            });
       
            setupEventListeners();
            
           }
    }
    





})(budgetController,UIController);



controller.init();










