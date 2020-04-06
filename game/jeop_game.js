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
            this.started = true //allow category to display
            this.showAnswer = false //don't show answer (question) yet
            this.getCategoryID()
        },
        getCategoryID(){
            fetch(categoryUrl) //call api for category id
            .then( res => res.json() )
            .then( catData => {
                let catId = catData[0].category_id
                console.log(catId)
                this.getClues(catId) //send category id to new API call
            })
        },
        getClues(catId){ //new api call to get answers (questions) (you know how Jeopardy switches the words around...)
            let newClueUrl = cluesUrl + catId
            fetch(newClueUrl)
            .then( res => res.json() )
            .then( clueData => {
                console.log(clueData)
                this.category = clueData.title.toUpperCase()
                for(i = 0; i < 5; i++){ //get first 5 answers (questions) from api -- it's easier to do this than to select a random set
                    console.log(clueData.clues[i])
                    this.clueSet.push(clueData.clues[i]) //push each answer to array
                }
                console.log(this.clueSet)
                for(i = 0; i < 5; i++){
                    if(this.clueSet[i] === ""){ //api sometimes sends empty answers to my array. This tries to prevent that (hard to test)
                        this.getCategoryID()
                        break
                    }
                }
            })
        },
        getAnswer(message){
            this.showAnswer = true
            console.log(message)
            switch(message){ //set values depending on dollar amount selected
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
        checkResponse(){ //tests user response against correct response
            correctQ = this.clueSet[this.clue].answer //get correct response
            
            question = this.userQ.toLowerCase() //set both to lowercase
            correctQ = correctQ.toLowerCase()

            question = question.trim() //remove extra spaces
            question = question.replace(/[^a-zA-Z0-9]/g, '') //found this at https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
            
            
            correctQ = correctQ.replace(/[^a-zA-Z0-9]/g, '') //remove special characters from correct response
            
            console.log(question)
            console.log(correctQ)
            console.log(correctQ.includes(question))
            if(question != '' && correctQ.includes(question)){ //i used includes() since some people will respond with just a last name or part of the correct response
                this.message = 'Correct! You add ' + this.value + ' to your total. Select again.' //display congratulations
            } else { //display correct response, change value to negative
                this.message = 'Sorry. The correct answer is ' + this.clueSet[this.clue].answer + '.'
                this.value *= -1
            }
            this.userQ = ''
            this.showMessage(this.message)
            this.score += this.value //update score
            if(this.value < 0){ //if negative, return to positive
                this.value *= -1
            }
        },
        showMessage(){
            this.seeMessage = true
            setTimeout( ()=>{
                this.seeMessage = false
            }, 7000) //display message for 7 seconds
        }

    }
})