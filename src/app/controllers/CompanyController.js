import * as Yup from 'yup';

import Company from '../schemas/Company';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      creci: Yup.string(),
      phones: Yup.array(
        Yup.object().shape({
          number: Yup.string().required(),
          isWhatsapp: Yup.bool(),
        })
      ),
      emails: Yup.array(Yup.string()),
      address: Yup.object().shape({
        street: Yup.string().required(),
        number: Yup.number(),
        neighborhood: Yup.string().required(),
        city: Yup.string().required(),
        cep: Yup.string().required(),
      }),
      logo: Yup.string(),
      officeHours: Yup.string(),
      domains: Yup.array(Yup.string()).required(),
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkUsernameExist = await Company.findOne({
      username: req.body.username,
    });

    if (checkUsernameExist) {
      return res.status(400).json({ error: 'Username alread exists' });
    }

    const checkDomainExist = await Company.findOne({
      domains: { $in: req.body.domains },
    });

    if (checkDomainExist) {
      return res.status(400).json({ error: 'Domain alread exists' });
    }

    const {
      name,
      creci,
      phones,
      emails,
      address,
      officeHours,
    } = await Company.create(req.body);

    return res.json({ name, creci, phones, emails, address, officeHours });
  }

  async index(req, res) {
    const company = await Company.findById(req.companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const { name, creci, phones, emails, address, officeHours } = company;

    return res.json({ name, creci, phones, emails, address, officeHours });
  }
}

export default new SessionController();
