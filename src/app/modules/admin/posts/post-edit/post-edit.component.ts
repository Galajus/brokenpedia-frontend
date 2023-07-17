import {Component, Input, OnInit} from '@angular/core';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Category} from "../model/category";
import {ActivatedRoute} from "@angular/router";
import {PostsService} from "../posts.service";
import {Post} from "../model/post";

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

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

  loaded: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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

    let postId = this.route.snapshot.params['id'];
    this.postService.getSinglePost(postId)
      .subscribe(post => {
        let cats: Array<Category> = [];
        if (post.categories) {
          cats = post.categories;
        }
        this.postForm.patchValue({
          isPublic: post.isPublic,
          title: post.title,
          description: post.description,
          content: post.content
        });
        const formArray: FormArray = this.postForm.get('categories') as FormArray;
        cats.forEach(cat => {
          formArray.push(new FormControl(cat));
        })
        this.loaded = true;
      })

  }

  save() {
    const formArray: FormArray = this.postForm.get('categories') as FormArray;
    const post = {
      id: this.route.snapshot.params['id'],
      isPublic: this.postForm.controls['isPublic'].value,
      title: this.postForm.controls['title'].value,
      description: this.postForm.controls['description'].value,
      content: this.postForm.controls['content'].value,
      categories: formArray.controls.map(c => c.value as Category)
    } as Post;
    this.postService.updatePost(post)
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
        if(ctrl.value.id == cat.id) {
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

  willBeChecked(cat: Category) {
    const formArray: FormArray = this.postForm.get('categories') as FormArray;
    let find = formArray.controls.find(ctrl => {
      return ctrl.value.id == cat.id;
    });

    return !!find;
  }

  protected readonly localStorage = localStorage;
}
