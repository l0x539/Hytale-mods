import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getCategories } from '../../_actions';
import TextEditor from '../TextEditor/TextEditor';
import TagBox from '../TagBox/TagBox';
import ImageDrop from '../ImageDrop/ImageDrop';
import { create_mod, upload_images } from '../../axios/functions';

import Quill from 'quill';

import './Upload.scss';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: new Set(),
      images: []
    };

    this.selectTag = this.selectTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(...data)
    try {
      var object = {};
      data.forEach((value, key) => {object[key] = value});

      var modname = object.mod
      var maplink = object.link
      var mod_description = JSON.stringify(this.state.quil.getContents());
      var images = this.state.images
      console.log(images)
      var tags = [...this.state.selectedTags].join(',')
      console.log({images:images,modname:modname,maplink:maplink,mod_description:mod_description, tags:tags})
      //return;
      create_mod(modname, mod_description, tags, maplink).then(r => {
        if (r.status === 'success') {
          if (images)
          if (images[0]) {
            const im = new FormData();
            im.append("mod_image", images[0][0])
            upload_images(im).then(e => {
              if (e.status !== 'success')
                alert(e.status)
                if (images[1]) {
                  const im = new FormData();
                  im.append("mod_image", images[1][0])
                  upload_images(im).then(e => {
                    if (e.status !== 'success')
                      alert(e.status)
                      if (images[2]) {
                        const im = new FormData();
                        im.append("mod_image", images[2][0])
                        upload_images(im).then(e => {
                          if (e.status !== 'success')
                            alert(e.status)
                            if (images[3]) {
                              const im = new FormData();
                              im.append("mod_image", images[3][0])
                              upload_images(im).then(e => {
                                if (e.status !== 'success')
                                  alert(e.status)
                                  if (images[4]) {
                                    const im = new FormData();
                                    im.append("mod_image", images[4][0])
                                    upload_images(im).then(e => {
                                      if (e.status !== 'success')
                                        alert(e.status)
                                        if (images[5]) {
                                          const im = new FormData();
                                          im.append("mod_image", images[5][0])
                                          upload_images(im).then(e => {
                                            if (e.status !== 'success')
                                              alert(e.status)
                                              if (images[6]) {
                                                const im = new FormData();
                                                im.append("mod_image", images[6][0])
                                                upload_images(im).then(e => {
                                                  if (e.status !== 'success')
                                                    alert(e.status)
                                                    if (images[7]) {
                                                      const im = new FormData();
                                                      im.append("mod_image", images[7][0])
                                                      upload_images(im).then(e => {
                                                        if (e.status !== 'success')
                                                          alert(e.status)
                                                          if (images[8]) {
                                                            const im = new FormData();
                                                            im.append("mod_image", images[8][0])
                                                            upload_images(im).then(e => {
                                                              if (e.status !== 'success')
                                                                alert(e.status)
                                                                if (images[9]) {
                                                                  const im = new FormData();
                                                                  im.append("mod_image", images[9][0])
                                                                  upload_images(im).then(e => {
                                                                    if (e.status !== 'success')
                                                                      alert(e.status)
                                                                  })
                                                                } else {
                                                                  alert("Done");
                                                                  window.location.reload()
                                                                }
                                                            })
                                                            
                                                          } else {
                                                            alert("Done");
                                                            window.location.reload()
                                                          }
                                                      })
                                                      
                                                    } else {
                                                      alert("Done");
                                                      window.location.reload()
                                                    }
                                                })
                                                
                                              } else {
                                                alert("Done");
                                                window.location.reload()
                                              }
                                          })
                                          
                                        } else {
                                          alert("Done");
                                          window.location.reload()
                                        }
                                    })
                                    
                                  } else {
                                    alert("Done");
                                    window.location.reload()
                                  }
                              })
                              
                            } else {
                              alert("Done");
                              window.location.reload()
                            }
                        })
                        
                      } else {
                        alert("Done");
                        window.location.reload()
                      }
                  })
                  
                } else {
                  alert("Done");
                  window.location.reload()
                }
            })
            
          }

       } else
          alert(r.status)
      })
    } catch (err) {
      console.log('Error: ', err.message);
    }
  }

  myCallback = (dataFromChild) => {
    var phrak = this.state.images
    phrak.push(dataFromChild)
    this.setState({images:phrak})
  }

  componentDidMount() {
    // Populate list of available mod tags
    this.props.getCategories();

    // Impoort font size
    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['1rem', '1.4rem', '3.5rem', '5rem'];
    Quill.register(Size, true);

    // Editor toolbar settings
    const toolbarOptions = [
      [{ 'size': ['1rem', '1.4rem', '3.5rem', '5rem'] }],      // custom dropdown
      ['bold', 'italic', 'underline', 'strike'],     // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],       // dropdown with defaults from theme
      ['clean']                                      // remove formatting button
    ];
    // Initiate Quill Text Editor
    // eslint-disable-next-line
    const quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Enter your mod description / 5000 character limit...',
      modules: {
        toolbar: toolbarOptions
      },
    });

    // Limit max char length
    const limit = 5000;

    quill.on('text-change', (delta, old, source) => {
      if (quill.getLength() > limit) {
        quill.deleteText(limit, quill.getLength());
      }
    });

    this.setState({quil:quill})
  }

  // Highlights selected tags
  selectTag(e) {
    e.target.className = (e.target.className === "mod-tags__tag") ? "mod-tags__tag--active" : "mod-tags__tag";
    console.log(e.target.innerHTML)
    // Edit state with list of selected tags
    this.state.selectedTags.has(e.target.innerHTML) ? this.removeTag(e.target.innerHTML) : this.addTag(e.target.innerHTML);
  }

  /**
   * Adds unique mod tag to current state
   * @param {String} item Selected Tag
   */
  addTag(item) {
    this.setState(({ selectedTags }) => ({
      selectedTags: new Set(selectedTags).add(item)
    }));
  }
  /**
  * Removes unique mod tag from current state
  * @param {String} item Selected Tag
  */
  removeTag(item) {
    this.setState(({ selectedTags }) => {
      const newChecked = new Set(selectedTags);
      newChecked.delete(item);

      return {
        selectedTags: newChecked
      };
    });
  }

  render() {
    return (
      <div className="upload__wrap">
        <div className="upload">
          <section className="tab">
            <h2 className="tab__title">Upload a new mod</h2>

            <form onSubmit={this.handleSubmit} className="form" encType="multipart/form-data" autoComplete="off">
              <div className="tab__input-wrap">
                <label htmlFor="mod" className="tab__label">Name of your mod:</label>
                <input type="text" name="mod" className="tab__input" placeholder="Enter mod name" required />
              </div>
              <TextEditor />
              <TagBox
                categories={this.props.info.categories}
                selectTag={this.selectTag}
              />
              <ImageDrop callbackFromParent={this.myCallback} />
              <div className="tab__input-wrap">
                <label htmlFor="link" className="tab__label">Download Link:</label>
                <input type="text" name="link" className="tab__input" placeholder="Download link (URL)" required />
              </div>
              <button type="submit" className="tabBtn">Submit Your Mod</button>
            </form>
          </section>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ info: state.info })

const mapDispatchToProps = {
  getCategories
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);

