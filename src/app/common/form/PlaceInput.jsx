import React, { Component } from 'react';
import PlacesAutoComplete from 'react-places-autocomplete';
import { Form, List, Segment, Label } from 'semantic-ui-react';

// const renderFunc = ({
//   getInputProps,
//   getSuggestionItemProps,
//   suggestions,
//   loading,
//   placeholder
// }) => (
//   <div>
//     <input {...getInputProps({ placeholder: placeholder })} />
//     {suggestions.length > 0 && (
//       <Segment className='autocomplete-dropdown-container'>
//         {loading && <div>Loading...</div>}
//         <List selection>
//           {suggestions.map(suggestion => (
//             <List.Item {...getSuggestionItemProps(suggestion)}>
//               <List.Header>
//                 {suggestion.formattedSuggestion.mainText}
//               </List.Header>
//               <List.Description>
//                 {suggestion.formattedSuggestion.secondaryText}
//               </List.Description>
//             </List.Item>
//           ))}
//         </List>
//       </Segment>
//     )}
//   </div>
// );

export default class PlaceInput extends Component {
  render() {
    const {
      input,
      width,
      onSelect,
      options,
      placeholder,
      meta: { touched, error }
    } = this.props;
    return (
      
        <PlacesAutoComplete
          value={input.value}
          onChange={input.onChange}
          searchOptions={options}
          onSelect={onSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <Form.Field error={touched && !!error} width={width}>
             
              <input
                placeholder={placeholder}
                {...getInputProps({placeholder})}
              />
              {touched && error && <Label basic color='red'>{error}</Label>}
              {suggestions.length > 0 && (
                <Segment style={{marginTop: 0}}>
                  {loading && <div>Loading...</div>}
                  <List selection>
                    {suggestions.map(suggestion => (
                      <List.Item {...getSuggestionItemProps(suggestion)}>
                        <List.Header>
                          {suggestion.formattedSuggestion.mainText}
                        </List.Header>
                        <List.Description>
                          {suggestion.formattedSuggestion.secondaryText}
                        </List.Description>
                      </List.Item>
                    ))}
                  </List>
                </Segment>
              )}
              
            </Form.Field>
          )}
        </PlacesAutoComplete>
    );
  }
}
