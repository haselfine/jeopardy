let categoryUrl = 'http://jservice.io/api/random'
let cluesUrl = 'http://jservice.io/api/category?id='

let game = new Vue({
    el: '#game',
    data: {
        name: '',
        answer: '',
        score: 0,
        started: false, //keeps category from displaying until user hits "new category"
        category: '', //category title
        clueSet: [],
        value: 0, //how much a correct question is worth
        clue: 0, //index in clueSet
        showAnswer: false,
        message: '',
        seeMessage: false,
        userQ: ''
    },
    methods: {
        btnBegin(){
            this.clueSet = []
            this.started = true
            this.showAnswer = false
            this.getCategoryID()
        },
        getCategoryID(){
            fetch(categoryUrl)
            .then( res => res.json() )
            .then( catData => {
                let catId = catData[0].category_id
                console.log(catId)
                this.getClues(catId)
            })
        },
        getClues(catId){
            let newClueUrl = cluesUrl + catId
            fetch(newClueUrl)
            .then( res => res.json() )
            .then( clueData => {
                console.log(clueData)
                this.category = clueData.title.toUpperCase()
                console.log(clueData.clues[0])
                for(i = 0; i < 5; i++){
                    this.clueSet.push(clueData.clues[i])
                }
                console.log(this.clueSet)
            })
        },
        getAnswer(message){
            this.showAnswer = true
            console.log(message)
            switch(message){
                case '200':
                    this.clue = 0
                    this.value = 200
                    this.answer = this.clueSet[0].question
                    break;
                case '400':
                    this.clue = 1
                    this.value = 400
                    this.answer = this.clueSet[1].question
                    break;
                case '600':
                    this.clue = 2
                    this.value = 600
                    this.answer = this.clueSet[2].question
                    break;
                case '800':
                    this.clue = 3
                    this.value = 800
                    this.answer = this.clueSet[3].question
                    break;
                case '1000':
                    this.clue = 4
                    this.value = 1000
                    this.answer = this.clueSet[4].question
                    break;
            }
            console.log(this.answer)
        },
        checkAnswer(){
            question = this.userQ
            correctQ = this.clueSet[this.clue].answer
            console.log(question)
            console.log(correctQ)
            console.log(question.localeCompare(correctQ, 'en', {sensitivity: 'base'}))
            if((question.localeCompare(correctQ, 'en', {sensitivity: 'base'}))==0){ //I use this instead of '===' because otherwise it's always true (for some reason)
                this.message = 'Correct! You add ' + this.value + ' to your total. Select again.'
            } else {
                this.message = 'Sorry. The correct answer is ' + this.clueSet[this.clue].answer + '.'
                this.value *= -1
            }
            this.userQ = ''
            this.showMessage(this.message)
            this.score += this.value
        },
        showMessage(){
            this.seeMessage = true
            setTimeout( ()=>{
                this.seeMessage = false
            }, 7000)
        }

    }
})