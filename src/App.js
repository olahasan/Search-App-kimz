// import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import UsePrevState from "./hooks/UseprevState";
function App() {
  const [term, setTerm] = useState("javascript");
  const [list, setList] = useState([]);
  const prevTerm = UsePrevState(term);

  useEffect(() => {
    const searchAPI = async () => {
      try {
        const response = await axios.get("https://en.wikipedia.org/w/api.php", {
          params: {
            action: "query",
            format: "json",
            origin: "*",
            list: "search",
            srsearch: term,
          },
        });
        console.log(response.data.query.search);
        setList(response.data.query.search);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!list.length && term) {
      searchAPI();
    } else if (prevTerm !== term) {
      const debounce = setTimeout(() => {
        // -- 1 -- Ensure that the term is not empty before making the request
        if (term) {
          //prevent first time fetching
          searchAPI();
        }
      }, 1400);

      return () => {
        clearTimeout(debounce);
      };
    }
  }, [term, list.length, prevTerm]);

  console.log(list);

  const showList = list.map((ele, idx) => {
    return (
      <tr key={ele.pageid}>
        <td>{idx + 1}</td>
        <td>{ele.title}</td>
        <td>
          <span dangerouslySetInnerHTML={{ __html: ele.snippet }} />
        </td>
      </tr>
    );
  });

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Control
                required
                type="text"
                placeholder="Search input"
                className="mt-3"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{showList}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
