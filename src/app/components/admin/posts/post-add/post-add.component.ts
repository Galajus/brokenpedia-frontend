import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {Post} from "@models/post/post";
import {PostsService} from "@services/admin/posts/posts.service";
import {Category} from "@models/post/category";

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.scss']
})
export class PostAddComponent implements OnInit {

  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: false,
    spellcheck: true,
    height: '500',
    minHeight: '450',
    maxHeight: '800',
    width: '1100',
    minWidth: '400',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Zawartość posta',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    toolbarPosition: 'top',
  };

  @Input() postForm!: FormGroup;
  categories?: Array<Category>;

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: PostsService
  ) { }

  ngOnInit(): void {
    this.postService.getCategories()
      .subscribe(cats => this.categories = cats);
    this.postForm = this.formBuilder.group({
      isPublic: [false],
      title: [''],
      description: [''],
      content: [''],
      categories: new FormArray([]),
    })

  }

  save() {
    const formArray: FormArray = this.postForm.get('categories') as FormArray;
    const post = {
      isPublic: this.postForm.controls['isPublic'].value,
      title: this.postForm.controls['title'].value,
      description: this.postForm.controls['description'].value,
      content: this.postForm.controls['content'].value,
      categories: formArray.controls.map(c => c.value as Category)
    } as Post;
    this.postService.createPost(post)
      .subscribe(resultPost => {
        console.log(resultPost);
      })
  }

  onCategoryChange(event: any, cat: Category) {
    const formArray: FormArray = this.postForm.get('categories') as FormArray;
    /* Selected */
    if(event.target.checked) {
      formArray.push(new FormControl(cat));
    }
    /* unselected */
    else {
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach((ctrl) => {
        if(ctrl.value == cat) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }

    let map = formArray.controls.map(c => c.value as Category);
    console.log(map)
  }
}
