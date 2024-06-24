/**
 * @typedef {Object} Contact
 * @property {string} name - The name of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} address - The address of the contact.
 *
 */


/**
 * @type {Contact[]}
 */
let phones  = []


/**
 *
 * @type {('edit'|'newContact')}
 */
let modalMode = 'edit'


const $ = document.querySelectorAll

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createListItem(name,phone){



 const templete = document.getElementById('list-item').content.cloneNode(true)

 //templete.firstElementChild.dataset.name = name


 templete.querySelector('img').src = `./images/${random(1,4)}.jpg`
 templete.querySelectorAll("li")[0].textContent = `${name} - ${phone}`


templete.firstElementChild.addEventListener('click',()=>{

 openModal(name,'edit')

}
)

 return templete
}





function initPhones(){

 phones = [...Array(4)]
 .map((value, index) => {

  return {name:`roei ${index+1}`,phone:'3333333333'}

 }
 )

 return phones

}





function render(listEl,arr){

 if (!listEl) throw new Error('list element empty')

 listEl.innerHTML = ''


 for (let item of arr){

 listEl.append(createListItem(item.name,item.phone))

 }

 const empty = document.getElementById('empty')

 if (arr.length === 0){
 empty.style.display = 'block'
 } else {
  empty.style.display = 'none'
 }

 }






 function searchContact(name = ''){

 if (!name?.trim()) {
 return phones
 }

 return phones.filter(x=>x['name'].includes(name))

 }




/**
 *
 * @param contact {Contact}
 */
 function save(contact){

 name = contact?.name?.trim()

 if (!name){
  throw new Error('bad name')
 }


  if (modalMode === 'newContact') {
  if (phones.find(x => x.name === contact.name)) {
  throw 'already exists'

  }
  }



 if (modalMode === 'newContact') {
  phones.push(contact)

 } else {
  phones[tempIndex] = contact
 }

 sortList()
 }





 function sortList(){
  phones.sort((a, b)=>a['name'].localeCompare(b['name']))
 }



/**
 *
 * @param name {string}
 * @param email {string}
 * @param phone {string}
 * @returns {Contact}
 */
function createContact({name,email = '',phone = 'None',address = ""}){

  return {name,email,phone,address}

 }




 function remove(name){

 const index = phones.findIndex(x=>x.name === name)

  if (index === -1){
  throw new Error('name not found')
  }


 const check = confirm(`delete ${phones[index].name}?`)

 if (check) {
 phones.splice(index, 1)
 sortList()
 }

  const listEl = document.getElementById('the-list')

  render(listEl,phones)

 }




 function clear(list_elem){
 phones = []

render(list_elem,phones)
 }




 let tempIndex= -1



/**
 *
 * @param name {string}
 * @param mode {'edit'|'newContact'}
 */
  function openModal(name = undefined,mode='edit'){

  modalMode = mode

  tempIndex = null




  const modal = document.getElementById('myModal')


  if (name){

  const index = phones.findIndex(x=>x.name === name)


  const person = phones[index]

  if (!person)  return

  tempIndex = index


  modal.querySelector('#title').textContent = name

  modal.querySelector('#name').value = name

  modal.querySelector('#phone').value = person.phone || 'None'

   modal.querySelector('#email').value = person.email || ''

  }


  document.body.style.overflow = 'hidden'

  modal.style.display = 'block'


 }






 function closeModal(){
   const modal = document.getElementById('myModal')

  modal.querySelector('#title').textContent = ''

  modal.querySelector('#name').value = ''

  modal.querySelector('#phone').value = ''

  modal.querySelector('#email').value = ''

  document.body.style.overflow = 'unset'

   modal.style.display = 'none'

 }





   function exitMsg(){
   window.addEventListener('beforeunload',(e)=>{
   e.preventDefault()

   e.returnValue = ''
   return true

  }
  )

  }





  function setModalListeners(listEl){
   const modal = document.getElementById('myModal')


   modal.querySelector('#save_btn').addEventListener('click',(e)=>{

    e.preventDefault()

    if (!e.target.form.reportValidity()){
    return
    }

    const name = modal.querySelector('#name').value
    const phone = modal.querySelector('#phone').value
    const email = modal.querySelector('#email').value

    try{
     save(createContact({name,phone,email}))

     closeModal()

     render(listEl,phones)

    }catch(e){
     alert(String(e))
    } finally {


    }


    }


    )





   modal.querySelector('#remove_btn').addEventListener('click',()=>{

    if (tempIndex == null) {
     return
    }

    try{
     remove(phones[tempIndex]?.name)


    }catch(e){

     alert(String(e))

    } finally{

     closeModal()

    }


   }
   )
   }






 function init() {

  const listEl = document.getElementById('the-list')



 exitMsg()


setModalListeners(listEl)



     document.getElementById('clearAll').addEventListener('click',()=>{

         const check = confirm('clear all?')
         if (check) {
             clear(listEl)
         }
     })


  initPhones()


  document.getElementById('addBtn')
  .addEventListener('click',()=>{

   openModal(undefined,'newContact')

  }
  )


  document.getElementById('myModal')
  .getElementsByClassName('close')[0]
  .addEventListener('click',()=>closeModal())






  render(listEl,phones)


  const search = document.getElementById('search')



  search.addEventListener('input',(ev)=>{

   const input = ev.target.value

   render(listEl,searchContact(input))


  }
  )







 }







document.addEventListener('DOMContentLoaded',()=>init())
